{Transform} = require 'stream'


# concatenates outputs generated by Agda executable,
# "Agda2>" as delimiter
class Concatenator extends Transform
  _buffer: ''
  _transform: (chunk, encoding, next) ->
    @_buffer += chunk.toString()

    # rips Agda2> prefix
    if @_buffer.startsWith 'Agda2>'
      @_buffer = @_buffer.substr 6

    lastIndex = @_buffer.lastIndexOf 'Agda2>'

    if lastIndex isnt -1
      @push @_buffer.substr 0, lastIndex
      @_buffer = @_buffer.substr (lastIndex + 6)
    next()





module.exports =
  Concatenator: Concatenator
