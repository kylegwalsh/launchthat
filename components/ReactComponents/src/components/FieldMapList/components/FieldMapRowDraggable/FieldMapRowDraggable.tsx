import * as React from 'react';
const { useState, memo, forwardRef, useImperativeHandle } = React;
import { Input, Select } from '../../../';
// tslint:disable-next-line: no-submodule-imports
import { MdCancel, MdAddCircle, MdDragHandle } from 'react-icons/md';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import './FieldMapRowDraggable.scss';

/**
 * Defines expected props for options
 */
interface IOption {
  /**
   * visible value for option
   */
  label: string;
  /**
   * actual value for option
   */
  value?: any;
}

/**
 * Defines expected props for ReactSelect options
 */
interface IReactSelectOption {
  /**
   * visible value for option
   */
  label: string;
  /**
   * actual value for option
   */
  value?: any;
  /**
   * nested options
   */
  options?: IOption[];
}

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * what possible options to allow as the targets (usually array of approved fields).
   * If not specified, the target will be a normal input
   */
  options?: IReactSelectOption[];
  /**
   * optional id for the mapping
   */
  id: number;
  /**
   * the key of the mapping
   */
  target: string;
  /**
   * the value of the mapping
   */
  output: string;
  /**
   * whether to show the label
   */
  showLabel?: boolean;
  /**
   * optional field to disable inputs
   */
  disabled?: {
    /**
     * disable target field
     */
    target?: boolean;
    /**
     * disable output field
     */
    output?: boolean;
  };
  /**
   * whether to disable both fields
   */
  disableAll?: boolean;
  /**
   * An index for the current for loop looping through the values
   */
  index: number;
  /**
   * function used to delete the row
   */
  deleteRow?: (...args: any[]) => any;
  /**
   * function used to add a new row
   */
  addRow?: (...args: any[]) => any;
  /**
   * object containing target and output errors
   */
  errors?: { target?: string, output?: string };
  /**
   * The category of the row
   */
  category: string;
  /**
   * Determines if the row is draggable
   */
  isDragDisabled: boolean;
  /**
   * A variable to check whether the category/column that this row
   * is in is being dragged over
   */
  draggingOver?: boolean;
  /**
   * Checks whether the ability to add in rows or delete them is added
   */
  disableAdditions?: boolean;
  /**
   * Determines whether or not the values should be automatically filled in the ouput
   */
  autofillOff?: boolean;
}

/**
 * A field map row component (used to map inputs to outputs)
 */
export const FieldMapRowDraggable = memo(forwardRef((props: IProps, ref) => {
  // Manage values locally
  // @ts-ignore
  const [id, setId] = useState(props.id);
  const [target, setTarget] = useState(props.target);
  const [output, setOutput] = useState(props.output);

  useImperativeHandle(ref, () => ({
    getValues() {
      const values: any = { target, output };
      if (id !== undefined) values.id = id;
      return values;
    },
  }), [id, target, output]);

  /**
   * If the row with the input is the last row, we need to add a new one before recording event
   * @param value - value from input change event
   * @param isTarget - whether the field was the target field
   * @param addRow - function to add a new row
   * @param select - whether the select was used
   */
  const checkInput = (
    value: string,
    isTarget: boolean,
    addRow?: (...ars: any[]) => any,
  ) => {
    // Set output value
    if (!isTarget) setOutput(value);

    // Set target value
    if (isTarget) {
      setTarget(value);
      // Pre-populate output if it was empty
      // Remove the auto populate feature
      if (!output && !props.autofillOff) setOutput(value);
    }
    
    // See if we need to add a new row
    if (!!addRow && !props.disableAdditions) {
      addRow(props.category);
    }
  };

  /**
   * Generate the icons next to the field (if needed)
   * @param deleteRow - function used to delete the row
   * @param addRow - function used to add a new row
   */
  // @ts-ignore
  const generateIcons = (deleteRow?: (...args: any[]) => any, addRow?: (...args: any[]) => any) => {
  // If add row function is provided, show add icon
    if (!!addRow) return <MdAddCircle className='fieldMapRow__addIcon' onClick={addRow}/>;
  // Otherwise, if delete function is provided, show delete icon
    if (!!deleteRow) return <MdCancel className='fieldMapRow__deleteIcon' onClick={deleteRow}/>;
  };

  return (
    <Draggable isDragDisabled={props.isDragDisabled} key={props.id} draggableId={props.id.toString()} index={props.index}>
      {(
          dragProvided: DraggableProvided,
          dragSnapshot: DraggableStateSnapshot,
        ) => (
      <div 
        key={props.id}
        className={`row 
          ${props.isDragDisabled && props.draggingOver ? 'fieldMapRow--disableInteraction' : ''} ${props.className ? props.className : ''}`}
        ref={dragProvided.innerRef}
        {...dragProvided.draggableProps}
        {...dragProvided.dragHandleProps}
      >
        <div {...dragProvided.dragHandleProps} className={`fieldMapRow__iconColumn`}>
          <MdDragHandle className={`fieldMapRow__dragIcon ${props.isDragDisabled ? 'fieldMapRow__dragIcon--notVisible' : ''}`}/>
        </div>
        <div className='column'>
          { // If options are provided, use select
            props.options &&
            <Select 
              value={target}
              disabled={props.disableAll || (props.disabled && props.disabled.target)}
              onChange={(value: any) => checkInput(value, true, props.addRow)}
              options={props.options}
              error={props.errors ? props.errors.target : undefined}
            />
          }
          { // If no options are provided, use normal input
            !props.options &&
            <Input
              disabled={props.disableAll || (props.disabled && props.disabled.target)}
              value={target}
              onChange={(event: any) => checkInput(event.target.value, true, props.addRow)}
              error={props.errors ? props.errors.target : undefined}
            />
          }
        </div>
        <div className='column'>
          <Input
            disabled={props.disableAll || (props.disabled && props.disabled.output)}
            value={output}
            onChange={(event: any) => checkInput(event.target.value, false, props.addRow)}
            error={props.errors ? props.errors.output : undefined}
          />
        </div>
        {
          !props.disableAdditions && 
        <div className={`fieldMapRow__iconColumn ${props.showLabel ? 'fieldMapRow__iconColumn__iconEnd' : ''}`}>
          {generateIcons(props.deleteRow, props.addRow)}
        </div>
        }
      </div>
      )}
  </Draggable>
  );
}));