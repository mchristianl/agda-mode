open Webapi.Dom;

open Js.Promise;

open Atom;

let makeTabElement = () => {
  open DomTokenListRe;
  let element = document |> Document.createElement("article");
  element |> Element.classList |> add("agda-mode");
  element;
};

let itemOptions = {
  "initialLine": 0,
  "initialColumn": 0,
  "split": "right",
  "activatePane": true,
  "activateItem": true,
  "pending": false,
  "searchAllPanes": true,
  "location": (None: option(string)),
};

let trigger = (callback: option(unit => unit)): unit =>
  switch (callback) {
  | Some(f) => f()
  | None => ()
  };

let triggerArg = (callback: option('a => unit), arg: 'a): unit =>
  switch (callback) {
  | Some(f) => f(arg)
  | None => ()
  };

type t = {
  element: Element.t,
  kill: unit => unit,
  activate: unit => unit,
};

let make =
    (
      ~editor: TextEditor.t,
      ~getTitle: unit => string,
      ~onOpen: option((Element.t, TextEditor.t, TextEditor.t) => unit)=?,
      ~onKill: option(unit => unit)=?,
      ~onClose: option(unit => unit)=?,
      ~onDidChangeActive: option(bool => unit)=?,
      (),
    ) => {
  let itemResource = Util.Resource.make();
  let closedDeliberately = ref(false);
  let subscriptions = CompositeDisposable.make();
  let previousItem =
    Environment.Workspace.getActivePane() |> Pane.getActiveItem;
  /* mount the view onto the element */
  let itemURI = "agda-mode://" ++ TextEditor.getPath(editor);
  let itemOpener = {"element": makeTabElement(), "getTitle": getTitle};
  /* add tab opener */
  Environment.Workspace.addOpener(givenURI =>
    givenURI == itemURI ? Some(itemOpener) : None
  )
  |> CompositeDisposable.add(subscriptions);
  /* open the registered tab opener */
  Environment.Workspace.open_(itemURI, itemOptions)
  |> then_(newItem => {
       itemResource.supply(newItem);
       /* this pane */
       let pane = Environment.Workspace.paneForItem(newItem);
       /* trigger the "onOpen" callback */
       switch (onOpen) {
       | Some(callback) =>
         callback(itemOpener##element, newItem, previousItem)
       | None => ()
       };
       /* onWillDestroyItem */
       pane
       |> Pane.onWillDestroyItem(event => {
            /* if the item that's going to be destroyed happens to be this tab */
            let destroyedTitle = Pane.getTitle(event##item);
            let getTitle = itemOpener##getTitle;
            if (destroyedTitle === getTitle()) {
              /* invoke the onKill or onClose */
              if (closedDeliberately^) {
                trigger(onKill);
              } else {
                trigger(onClose);
              };
              /* dispose subscriptions */
              CompositeDisposable.dispose(subscriptions);
            };
          })
       |> CompositeDisposable.add(subscriptions);
       /* onDidChangeActive */
       pane
       |> Pane.onDidChangeActiveItem(item => {
            let activatedTitle = Pane.getTitle(item);
            let getTitle = itemOpener##getTitle;
            if (activatedTitle == getTitle()) {
              triggerArg(onDidChangeActive, true);
            } else {
              triggerArg(onDidChangeActive, false);
            };
          })
       |> CompositeDisposable.add(subscriptions);
       /* return the previously active pane */
       resolve(Environment.Workspace.getActivePane());
     })
  |> ignore;
  {
    element: itemOpener##element,
    kill: () =>
      itemResource.acquire()
      |> Js.Promise.then_(item => {
           /* dispose subscriptions */
           CompositeDisposable.dispose(subscriptions);
           /* set the "closedDeliberately" to true to trigger "onKill" */
           closedDeliberately := true;
           Environment.Workspace.paneForItem(item)
           |> Pane.destroyItem(item)
           |> Js.Promise.resolve;
         })
      |> ignore,
    activate: () =>
      itemResource.acquire()
      |> Js.Promise.then_(item =>
           Environment.Workspace.paneForItem(item)
           |> Pane.activateItem(item)
           |> Js.Promise.resolve
         )
      |> ignore,
  };
};