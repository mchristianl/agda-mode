{Transform} = require 'stream'

UNKNOWN = 0
STATUS_ACTION = 1
INFO_ACTION = 2
GOALS_ACTION = 3
HIGHLIGHT_CLEAR = 3

# concatenates outputs generated by Agda executable,
# "Agda2>" and newline as delimiter
class Rectifier extends Transform
  constructor: ->
    super
      objectMode: true

  _buffer: ''
  _transform: (chunk, encoding, next) ->
    @_buffer += chunk.toString()

    # rips Agda2> prefix
    if @_buffer.startsWith 'Agda2>'
      @_buffer = @_buffer.substr 6

    lastIndex = @_buffer.lastIndexOf 'Agda2>'

    if lastIndex isnt -1
      block = @_buffer.substr 0, lastIndex
      for string in block.split '\n'
        if string.length isnt 0
          @push string
      @_buffer = @_buffer.substr (lastIndex + 6)
    next()


class Command extends Transform
  constructor: ->
    super
      objectMode: true

  _transform: (chunk, encoding, next) ->

    # drop wierd prefix like ((last . 1))
    if chunk.startsWith '((last'
      index = chunk.indexOf '(agda'
      length = chunk.length
      chunk = chunk.substring index, length - 1

    # remove the outermost parenthesis
    chunk = chunk.substring 1, chunk.length - 1

    # split into list of tokens
    tokens = chunk.split ' '



    switch tokens[0]

      when "agda2-status-action" then command =
        type: STATUS_ACTION
        status: tokens[1]

      when "agda2-info-action" then command =
        type: INFO_ACTION
        header: tokens[1]
        content: tokens[2]

      when "agda2-goals-action" then command =
        type: GOALS_ACTION
        goals: tokens[1]

      when "agda2-highlight-clear" then command =
        type: HIGHLIGHT_CLEAR

      else command = type: UNKNOWN


    @push chunk
    next()




module.exports =
  Rectifier: Rectifier
  Command: Command
  toString: toString
