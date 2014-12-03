/**
 * @fileoverview Textbutton field.
 * @author Leo Gordon
 */
'use strict';

goog.provide('Blockly.FieldTextbutton');

goog.require('Blockly.Field');


Blockly.FieldTextbutton = function(buttontext, changeHandler) {
  Blockly.FieldTextbutton.superClass_.constructor.call(this, '');

  this.buttontext_ = buttontext;
  this.changeHandler_ = changeHandler;
  this.setText(buttontext);
};
goog.inherits(Blockly.FieldTextbutton, Blockly.Field);


Blockly.FieldTextbutton.prototype.clone = function() {
  return new Blockly.FieldTextbutton(this.buttontext_, this.changeHandler_);
};


Blockly.FieldTextbutton.prototype.CURSOR = 'default';


Blockly.FieldTextbutton.prototype.showEditor_ = function() {
  if (this.changeHandler_) {
    this.changeHandler_();
  }
};


/*
    
//    An example of how to use FieldTextbutton: implementation of a simple register with limiters linked to "-" and "+" buttons

Blockly.Block.appendMinusPlusCounter = function(block, name, startValue, lowerLimit, upperLimit) {
    block.appendDummyInput(name+'_input')
        .appendField(name+':', name+'_label')
        .appendField(String(startValue || '0'), name)
        .appendField(new Blockly.FieldTextbutton('–', function() { var counter_=parseInt(this.sourceBlock_.getFieldValue(name))-1; if((lowerLimit===undefined) || counter_>=lowerLimit) { this.sourceBlock_.setFieldValue(String(counter_), name); } }), name+'_minus')
        .appendField(new Blockly.FieldTextbutton('+', function() { var counter_=parseInt(this.sourceBlock_.getFieldValue(name))+1; if((upperLimit===undefined) || counter_<=upperLimit) { this.sourceBlock_.setFieldValue(String(counter_), name); } }), name+'_plus');
}

//  A usage example of the above. You can add two independent MinusPlusCounters to a block by saying:

    Blockly.Block.appendMinusPlusCounter(this, 'age', 0, 0 );
    Blockly.Block.appendMinusPlusCounter(this, 'temperature', 37, 34, 42 );

*/
