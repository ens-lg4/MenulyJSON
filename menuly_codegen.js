'use strict';


Blockly.JSON = new Blockly.Generator('JSON');


Blockly.JSON['start'] = function(block) {

    var json    = this.generalBlockToObj( block.getInputTargetBlock( 'json' ) );

    return json;
};

Blockly.JSON['true'] = function(block) {
    return true;
};


Blockly.JSON['false'] = function(block) {
    return false;
};


Blockly.JSON['string'] = function(block) {
    var string_value = block.getFieldValue( 'string_value' );

    return string_value ;
};


Blockly.JSON['number'] = function(block) {
    var number_value = Number(block.getFieldValue( 'number_value' ));

    return number_value ;
};


Blockly.JSON['dictionary'] = function(block) {

    var dictionary = {};

    for(var i = 0; i<block.length; i++) {
        var pair_key    = block.getFieldValue( 'key_field_'+i );
        var pair_value  = this.generalBlockToObj( block.getInputTargetBlock( 'element_'+i ) );

        dictionary[pair_key] = pair_value;
    }

    return dictionary;
};


Blockly.JSON['array'] = function(block) {

    var array = [];

    for(var i = 0; i<block.length; i++) {
        var element_value  = this.generalBlockToObj( block.getInputTargetBlock( 'element_'+i ) );

        array[i] = element_value;
    }

    return array;
};


Blockly.JSON.generalBlockToObj = function(block) {

    if(block) {

            // dispatcher:
        var func = this[block.type];
        if(func) {
            return func.call(this, block);
        } else {
            console.log("Don't know how to generate JSON code for a '"+block.type+"'");
        }
    } else {
        return null;
    }
};


Blockly.JSON.fromWorkspace = function(workspace) {

    var json_text = '';

    var top_blocks = workspace.getTopBlocks(false);
    for(var i in top_blocks) {
        var top_block = top_blocks[i];

        if(top_block.type == 'start') {
            var json_structure = this.generalBlockToObj( top_block );

            json_text += JSON.stringify(json_structure, null, 4) + '\n\n';
        }
    }

    return json_text;
};


Blockly.JSON.toWorkspace = function(json_text, workspace) {

    var json_structure  = JSON.parse(json_text);

    workspace.clear();

    var startBlock = Blockly.Block.obtain(workspace, 'start');
    startBlock.initSvg();
    startBlock.render();
    Blockly.JSON.buildAndConnect(json_structure, startBlock.getInput('json').connection);
};


Blockly.JSON.buildAndConnect = function(json_structure, parentConnection) {
    if(json_structure === null) {
        return;
    } else {
        var type  = typeof(json_structure);
        if(type == 'boolean') {
            type = String(Boolean(json_structure));
        } else if(type == 'object') {
            type = (json_structure instanceof Array) ? 'array' : 'dictionary';
        }

        var targetBlock = Blockly.Block.obtain(parentConnection.sourceBlock_.workspace, type);
        targetBlock.initSvg();
        targetBlock.render();

        var childConnection = targetBlock.outputConnection;
        parentConnection.connect(childConnection);

        switch(type) {
            case 'string':
                targetBlock.setFieldValue( String(json_structure), 'string_value' );
                break;
            case 'number':
                targetBlock.setFieldValue( String(json_structure), 'number_value' );
                break;
            case 'dictionary':
                var i=0;
                for(var key in json_structure) {
                    targetBlock.appendKeyValuePairInput();
                    targetBlock.setFieldValue( key, 'key_field_'+i );

                    var elementConnection = targetBlock.getInput('element_'+i).connection;
                    Blockly.JSON.buildAndConnect(json_structure[key], elementConnection);

                    i++;
                }
                break;
            case 'array':
                for(var i in json_structure) {
                    targetBlock.appendArrayElementInput();

                    var elementConnection = targetBlock.getInput('element_'+i).connection;
                    Blockly.JSON.buildAndConnect(json_structure[i], elementConnection);
                }
                break;
        }
    }
};

