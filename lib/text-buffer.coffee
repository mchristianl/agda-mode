fs              = require 'fs'
_               = require 'lodash'
{Point, Range}  = require 'atom'
Promise         = require 'bluebird'

{getHoles}          = require './text-buffer/hole'
Goal                = require './text-buffer/goal'
{log, warn}         = require './logger'
err    = require './error'

class TextBuffer

    goals: []

    constructor: (@core) ->

    #########################
    #   Cursor Management   #
    #########################

    protectCursor: (callback) ->
        position = @core.editor.getCursorBufferPosition()
        callback()
        @getCurrentGoal position
            .then (goal) =>
                newPosition = @core.editor.translate goal.range.start, 3
                @core.editor.setCursorBufferPosition newPosition
            .catch err.OutOfGoalError, =>
                @core.editor.setCursorBufferPosition position

    focus: ->
        textEditorElement = atom.views.getView(@core.editor)
        textEditorElement.focus()

    #######################
    #   File Management   #
    #######################

    saveBuffer: -> @core.editor.save()

    #######################
    #   Goal Management   #
    #######################

    removeGoals: ->
        log 'Text Buffer', 'remove goals'
        @goals.forEach (goal) -> goal.destroy()
        @goals = []

    removeGoal: (index) ->
        @goals
          .filter (goal) => goal.index is index
          .forEach (goal) => goal.destroy()
        @goals = @goals.filter (goal) => goal.index isnt index

    findGoal: (index) ->
        goals = @goals.filter (goal) => goal.index is index
        return goals[0]

    getCurrentGoal: (cursor = @core.editor.getCursorBufferPosition()) =>
        new Promise (resolve, reject) =>
            goals = @goals.filter (goal) =>
                goal.range.containsPoint cursor
            if goals.length is 1
                resolve goals[0]
            else
                reject new err.OutOfGoalError

    warnOutOfGoal: =>
        warn 'Text Buffer', 'out of goal'
        @core.panelModel.set 'Out of goal', ['For this command, please place the cursor in a goal'], 'warning'

    warnEmptyGoal: (error) =>
        warn 'Text Buffer', 'empty content'
        @core.panelModel.set 'No content', [error.message], 'warning'

    # query for expression if the goal is empty
    checkGoalContent: (message) => (goal) =>
        content = escape goal.getContent()
        if content
            Promise.resolve goal
        else
            @core.panelModel.set "Give", [], 'info', 'expression to give:'
            @core.panelModel
                .query()
                .then (expr) =>
                    if expr
                        goal.setContent expr
                        Promise.resolve goal
                    else
                        Promise.reject new err.EmptyGoalError message
                , =>
                    Promise.reject new err.EmptyGoalError message

    ################
    #   Commands   #
    ################

    nextGoal: ->

        cursor = @core.editor.getCursorBufferPosition()
        nextGoal = null

        positions = @goals.map (goal) =>
            start = goal.range.start
            @core.editor.translate start, 3

        positions.forEach (position) =>
            if position.isGreaterThan cursor
                nextGoal ?= position

        # no goal ahead of cursor, loop back
        if nextGoal is null
            nextGoal = positions[0]

        # jump only when there are goals
        if positions.length isnt 0
            @core.editor.setCursorBufferPosition nextGoal

    previousGoal: ->
        cursor = @core.editor.getCursorBufferPosition()
        previousGoal = null

        positions = @goals.map (goal) =>
            start = goal.range.start
            @core.editor.translate start, 3

        positions.forEach (position) =>
            if position.isLessThan cursor
                previousGoal = position

        # no goal ahead of cursor, loop back
        if previousGoal is null
            previousGoal = positions[positions.length - 1]

        # jump only when there are goals
        if positions.length isnt 0
            @core.editor.setCursorBufferPosition previousGoal

    ########################
    #   Command Handlers   #
    ########################

    onGoalsAction: (indices) -> @protectCursor =>
        textRaw = @core.editor.getText()
        @removeGoals()
        getHoles(textRaw, indices).forEach (token) =>
            range = @core.editor.fromCIRange token.originalRange
            @core.editor.setTextInBufferRange range, token.content
            goal = new Goal @core.editor, token.goalIndex, token.modifiedRange
            @goals.push goal

    onGiveAction: (index, content, paran) -> @protectCursor =>

        goal = @findGoal index
        if content.length > 0
            content = content.replace(/\\n/g, ' ').replace(/\s{2,}/g, ' ')
            log 'Text Buffer', "handling give-action #{paran} #{content}"
            goal.setContent content
        if paran
            content = goal.getContent()
            goal.setContent "(#{content})"

        goal.removeBoundary()
        @removeGoal index

    onMakeCaseAction: (content) ->  @protectCursor =>
         @getCurrentGoal().then (goal) =>
                goal.writeLines content
            .catch @warnOutOfGoal

    onGoto: (filepath, charIndex) ->
        if @core.filepath is filepath
            position = @core.editor.fromIndex charIndex - 1
            @core.editor.setCursorBufferPosition position
            # scroll down a bit further, or it would be shadowed by the panel
            @core.editor.scrollToBufferPosition position.translate(new Point(10, 0))

    # Agda generates files with syntax highlighting notations,
    # those files are temporary and should be deleted once used.
    # note: no highlighting yet, we'll just delete them.
    onHighlightLoadAndDelete: (filepath) -> fs.unlink filepath

module.exports = TextBuffer
