'use strict';


Blockly.Blocks['start'] = {
  init: function() {
    this.setColour(250);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("JSON structure");

//  TODO: we need a way to sense the docking of a value block
//        in order to update the label on the dropdown menu
//
//    this.appendValueInput('sensor')
//        .appendField('sensor_field');

    this.appendValueInput('json')
        .appendSelector(['dictionary', 'array', 'string', 'number', 'true', 'false'], '→', 'null');


    this.setDeletable(false);
  }
};


Blockly.Blocks['true'] = {
  init: function() {
    this.setColour(20);
    this.setOutput(true, ["element"]);

    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('true');
  }
};


Blockly.Blocks['false'] = {
  init: function() {
    this.setColour(20);
    this.setOutput(true, ["element"]);

    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('false');
  }
};


Blockly.Blocks['string'] = {
  init: function() {
    this.setColour(190);
    this.setOutput(true, ["element"]);

    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('"')
        .appendField(new Blockly.FieldTextInput(''), 'string_value')
        .appendField('"');
  }
};


Blockly.Blocks['number'] = {
  init: function() {
    this.setColour(210);
    this.setOutput(true, ["element"]);

    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('№')
        .appendField(new Blockly.FieldTextInput('0', Blockly.FieldTextInput.numberValidator), "number_value");
  }
};


Blockly.Blocks['dictionary'] = {
  length: 0,
  init: function() {
    this.setColour(120);
    this.setOutput(true, ["element"]);

    this.appendDummyInput('open_bracket')
        .appendField(" { ")
        .appendField(new Blockly.FieldTextbutton('+', function() { this.sourceBlock_.appendKeyValuePairInput(); }) );

    this.appendDummyInput('close_bracket')
        .appendField(" } ");

    this.setInputsInline(false);
  },

  appendKeyValuePairInput: function() {

        var lastIndex = this.length++;

        var appended_input = this.appendValueInput('element_'+lastIndex);
        appended_input.appendField(new Blockly.FieldTextbutton('–', function() { this.sourceBlock_.deleteKeyValuePairInput(appended_input); }) )
            .appendField(new Blockly.FieldTextInput('key_'+lastIndex), 'key_field_'+lastIndex)
            .appendField("⇒")
            .appendSelector(['string', 'number', 'true', 'false', 'dictionary', 'array'], '→', 'null');

        this.moveInputBefore('element_'+lastIndex, 'close_bracket');

        return appended_input;
  },

  deleteKeyValuePairInput: function(inputToDelete) {

        var inputNameToDelete = inputToDelete.name;

        var substructure = this.getInputTargetBlock(inputNameToDelete);
        if(substructure) {
            substructure.dispose(true, true);
        }
        this.removeInput(inputNameToDelete);

        var inputIndexToDelete = parseInt(inputToDelete.name.match(/\d+/)[0]);

        var lastIndex = --this.length;

        for(var i=inputIndexToDelete+1; i<=lastIndex; i++) { // rename all the subsequent element-inputs
            var input       = this.getInput( 'element_'+i );
            input.name      = 'element_'+(i-1);

            var key_field   = this.getField_( 'key_field_'+i );
            key_field.name  = 'key_field_'+(i-1);
        }
  }
};


Blockly.Blocks['array'] = {
  length: 0,
  init: function() {
    this.setColour(350);
    this.setOutput(true, ["element"]);

    this.appendDummyInput('open_bracket')
        .appendField(" [ ")
        .appendField(new Blockly.FieldTextbutton('+', function() { this.sourceBlock_.appendArrayElementInput(); }) );

    this.appendDummyInput('close_bracket')
        .appendField(" ] ");

    this.setInputsInline(false);
  },

  appendArrayElementInput: function() {

        var lastIndex = this.length++;

        var appended_input = this.appendValueInput('element_'+lastIndex);
        appended_input.appendField(new Blockly.FieldTextbutton('–', function() { this.sourceBlock_.deleteArrayElementInput(appended_input); }) )
            .appendSelector(['string', 'number', 'true', 'false', 'dictionary', 'array'], '→', 'null');

        this.moveInputBefore('element_'+lastIndex, 'close_bracket');

        return appended_input;
  },

  deleteArrayElementInput: function(inputToDelete) {

        var inputNameToDelete = inputToDelete.name;

        var substructure = this.getInputTargetBlock(inputNameToDelete);
        if(substructure) {
            substructure.dispose(true, true);
        }
        this.removeInput(inputNameToDelete);

        var inputIndexToDelete = parseInt(inputToDelete.name.match(/\d+/)[0]);

        var lastIndex = --this.length;

        for(var i=inputIndexToDelete+1; i<=lastIndex; i++) { // rename all the subsequent element-inputs
            var input  = this.getInput( 'element_'+i );

            input.name = 'element_'+(i-1);
        }
  }
};

