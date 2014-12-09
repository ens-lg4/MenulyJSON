'use strict';


    // Disable blocks lying around the workspace unconnected to our main start block.
    // (original idea stolen from OpenRoberta and optimized)

var original_onMouseUp_ = Blockly.Block.prototype.onMouseUp_;

Blockly.Block.prototype.onMouseUp_ = function(e) {
    original_onMouseUp_.call(this, e);

    if (Blockly.selected) {
        var rootBlock = Blockly.selected.getRootBlock();

        var isDisabled = (rootBlock.type != 'start');

        var descendants = Blockly.selected.getDescendants();
        for(var i in descendants) {
            descendants[i].setDisabled(isDisabled);
        }
    }
};


Blockly.FieldDropdown.prototype.setValue = function(newValue) {      // Allow the label on the closed menu to differ from values of the open menu
  this.value_ = newValue;
  // Look up and display the human-readable text.
  var options = this.getOptions_();
  for(var x = 0; x < options.length; x++) {
    // Options are tuples of human-readable text and language-neutral values.
    if (options[x][1] == newValue) {
      var shortValue = options[x][2] || options[x][0];
      this.setText(shortValue);
      return;
    }
  }
};


Blockly.Input.prototype.appendSelector = function(allowedBlocks, presenceLabel, absenceLabel) {

    var presenceLabel   = presenceLabel || this.name;
    var absenceLabel    = absenceLabel  || 'no '+this.name;
    var ddl_name        = 'ddl_'+this.name;

    var dd_list = [
        [ absenceLabel, ':REMOVE', absenceLabel]
    ];
    if(allowedBlocks.length == 1) {
        dd_list.push( [presenceLabel+': ', allowedBlocks[0], presenceLabel ] );
    } else {
        for(var i = 0; i < allowedBlocks.length; i++) {
            dd_list.push( [allowedBlocks[i], allowedBlocks[i], presenceLabel ] );
        }
    }

    var this_input = this;

    this//.setCheck(allowedBlocks)  // FIXME: we'll need to re-establish the connection rules somehow!
        .setAlign( this.type == Blockly.INPUT_VALUE ? Blockly.ALIGN_RIGHT : Blockly.ALIGN_LEFT)
        .appendField(new Blockly.FieldDropdown( dd_list, function(targetType) {

                    return this.sourceBlock_.toggleTargetBlock(this_input, targetType);
                }
        ), ddl_name);

    return this;
};


Blockly.Block.prototype.toggleTargetBlock = function(input, targetType) {     // universal version: can create any type of targetBlocks

    var targetBlock = input ? this.getInputTargetBlock(input.name) : this.getNextBlock();              // named input or next
    if( targetType==':REMOVE' ) {
        if(targetBlock) {
            targetBlock.dispose(true, true);    // or targetBlock.unplug(...)
        }
    } else {
        if(targetBlock) {   // Don't remove it, but return the "override" value to make sure the DDL is up to date:
            return targetBlock.type;
        } else {            // add a new kind of block:
            targetBlock = Blockly.Block.obtain(Blockly.getMainWorkspace(), targetType);
            targetBlock.initSvg();
            targetBlock.render();

            var parentConnection = input ? this.getInput(input.name).connection : this.nextConnection;     // named input or next
            var childConnection = targetBlock.outputConnection || targetBlock.previousConnection;          // vertical or horizontal
            parentConnection.connect(childConnection);
        }
    }
};


    // A very useful mapping from connection back to input
Blockly.Connection.prototype.getInput = function() {
    var inputList = this.sourceBlock_.inputList;

    for(var i in inputList) {
        var connection = inputList[i].connection;
        if(connection == this) {
            return inputList[i];
        }
    }
};


    // If there is a ddl linked with the input, update its label to the type of the block plugged in:
Blockly.Input.prototype.updateLinkedDDL = function() {

    var ddl_name    = 'ddl_'+this.name;
    var ddl_field   = this.sourceBlock_.getField_(ddl_name);
    if(ddl_field) {
        var targetBlock = this.connection.targetBlock();
        var type = targetBlock ? targetBlock.type : ':REMOVE';
        ddl_field.setValue(type);
    }
}


    // Update the DDL on connect() :
var original_connect = Blockly.Connection.prototype.connect;

Blockly.Connection.prototype.connect = function(otherConnection) {

    original_connect.call(this, otherConnection);

    var parentConnection = this.isSuperior() ? this : otherConnection;  // since connect() is symmetrical we never know which way it is called

    parentConnection.getInput().updateLinkedDDL();
};


    // Update the DDL on disconnect() :
var original_disconnect = Blockly.Connection.prototype.disconnect;

Blockly.Connection.prototype.disconnect = function() {

    var parentConnection = this.isSuperior() ? this : this.targetConnection;  // since disconnect() is symmetrical we never know which way it is called

    original_disconnect.call(this);

    parentConnection.getInput().updateLinkedDDL();
};

