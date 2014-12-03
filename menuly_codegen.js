'use strict';


Blockly.JSON = new Blockly.Generator('JSON');


Blockly.JSON['start'] = function(block) {

    var json    = this.generalBlockToObj( block.getInputTargetBlock( 'json' ), false );

    return json;
}


Blockly.JSON['scalar'] = function(block) {
    var scalar_value = block.getFieldValue( 'scalar_value' );

    return scalar_value ;
}


Blockly.JSON['dictionary'] = function(block) {

    var dictionary = {};

    for (var i = 0; i<block.length; i++) {
        var pair_key    = block.getFieldValue( 'key_field_'+i );
        var pair_value  = this.generalBlockToObj( block.getInputTargetBlock( 'element_'+i ), false );

        dictionary[pair_key] = pair_value;
    }

    return dictionary;
}


Blockly.JSON['array'] = function(block) {

    var array = [];

    for (var i = 0; i<block.length; i++) {
        var element_value  = this.generalBlockToObj( block.getInputTargetBlock( 'element_'+i ), false );

        array[i] = element_value;
    }

    return array;
}


Blockly.JSON.generalBlockToObj = function(block, returnarray) {

    if(block) {

            // dispatcher:
        var func = this[block.type];
        if(func) {
            return func.call(this, block);
        }

        var obj = {
            'ID'    : block.id,
            'CLASS' : block.type,
        };

        returnarray = returnarray || (block.nextConnection ? true : false);

        for (var i = 0, inputLine; inputLine = block.inputList[i]; i++) {

            for (var y = 0, field; field = inputLine.fieldRow[y]; y++) {
                if (field.name && field.EDITABLE) {
                    // inputnode.fields[field.name] = field.getValue();     // the direct way assumes we scan through fields in a 2D order (all fields or all inputLines)
                                                                            //
                    obj[field.name] = block.getFieldValue( field.name );    // however I'd like to make sure we can access the same data directly, by using field's name
                                                                            // it works!!!
                }
            }

            if (inputLine.type != Blockly.DUMMY_INPUT) {        // dummy means there may be fields, but no slots
                // var inputBlock = inputLine.connection.targetBlock();      // same trick here - we'd like to access an inputBlock using its name

                var inputBlock = block.getInputTargetBlock( inputLine.name );


                if (inputLine.type == Blockly.INPUT_VALUE) {
                    obj[inputLine.name + '(value)'] = this.generalBlockToObj( inputBlock, false );

                } else if (inputLine.type == Blockly.NEXT_STATEMENT) {
                    obj[inputLine.name + '(statement)'] = this.generalBlockToObj( inputBlock, false );
                }
            }
        }

        if( returnarray ) {
            var nextBlock = block.getNextBlock();
            if (nextBlock) {
                var tail = this.generalBlockToObj( nextBlock, true );
                tail.unshift( obj );
                return tail;
            } else {
                return [ obj ];
            }
        } else {
            return obj;
        }

    } else if( returnarray ) {
        return [];
    } else {
        return null;
    }
}


Blockly.JSON.workspaceToJSON = function(workspace, block_id) {

    var json_text = '';

    var blocks = block_id
        ? [ workspace.getBlockById( block_id ) ]
        : workspace.getTopBlocks(true);

    for (var i = 0, block; block = blocks[i]; i++) {

        var obj = this.generalBlockToObj( block, false );
        json_text += JSON.stringify(obj, null, 4) + '\n\n';
    }

    return json_text;
};

