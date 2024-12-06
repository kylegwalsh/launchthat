import * as React from 'react';
const { useState, memo, forwardRef, useImperativeHandle } = React;
import { Draggable, DraggableStateSnapshot, DraggableProvided } from 'react-beautiful-dnd';
import './FieldMapColumn.scss';
import { Label, Input } from '../../../';
// tslint:disable-next-line: no-submodule-imports
import { MdCancel, MdAddCircle, MdDragHandle } from 'react-icons/md';

interface IProps {
  category: string;
  index: number;
  children: React.ReactChild;
  /**
   * function used to add a new row
   */
  addCategory?: (...args: any[]) => any;
  /**
   * Function used to add a new category
   */
  deleteCategory?: (...args: any[]) => any;
  /**
   * Determines if the column is draggable or not
   */
  isDragDisabled: boolean;
  /**
   * The id of the category
   */
  id: number;
  /**
   * An error object that contains the proper error messages to be displayed
   */
  error?: string; 
  /**
   * Labels
   */
  labels?: {
    target: string;
    output: string;
  };
  /**
   * whether the field map is disabled
   */
  disabled?: boolean;
  /**
   * Check whether to disable addtions or deletions
   */
  disabledAdditions?:boolean;
}

export const FieldMapColumn = memo(forwardRef((props: IProps, ref) => {
  const index = props.index;
  // @ts-ignore
  const [id, setId] = useState(props.id);
  const [ category, setCategory ] = useState(props.category.includes('blank_row') ? '' : props.category);

  useImperativeHandle(ref, () => ({
    getValues() {
      console.log(category);
      const values: any = { category };
      if (id !== undefined) values.id = id;
      return values;
    },
  }), [category, id]);

  /**
   * If the row with the input is the last row, we need to add a new one before recording event
   * @param value - value from input change event
   * @param isTarget - whether the field was the target field
   * @param addRow - function to add a new row
   * @param select - whether the select was used
   */
  const checkInput = (
    value: string,
  ) => {
    // Set the value of the category
    setCategory(value);
  };

  /**
   * Generate the icons next to the field (if needed)
   * @param deleteRow - function used to delete the row
   * @param addRow - function used to add a new row
   */
  // @ts-ignore
  const generateIcons = (deleteCategory?: (...args: any[]) => any, addCategory?: (...args: any[]) => any) => {
    // If add row function is provided, show add icon
    if (!!addCategory) return <MdAddCircle className='fieldMapColumn__addIcon' onClick={addCategory}/>;
    // Otherwise, if delete function is provided, show delete icon
    if (!!deleteCategory) return <MdCancel className='fieldMapColumn__deleteIcon' onClick={deleteCategory}/>;
  };

  return (
      <Draggable
       isDragDisabled={props.isDragDisabled}
       key={props.id}
       draggableId={props.category} 
       index={index}
      >
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
              key={props.id}
              className='fieldMapColumn__container' 
              ref={provided.innerRef} 
              {...provided.draggableProps}
            >
              <div className={`fieldMapColumn__header ${snapshot.isDragging ? 'fieldMapColumn__header--isDragging' : ''}`}>
                <div {...provided.dragHandleProps} className={`fieldMapColumn__iconColumn`}>
                  <MdDragHandle className={`fieldMapColumn__dragIcon`}/>
                </div>
                {
                  <div className={`fieldMapColumn__inputWrapper`} {...provided.dragHandleProps}>
                      <Input
                        value={category}
                        disabled={props.disabled}
                        placeholder={'Add in a category'}
                        className={{ container: `fieldMapColumn__titleInputContainer`, input: `fieldMapColumn__title` }}
                        onChange={(event: any) => checkInput(event.target.value)}
                        error={props.error ? props.error : undefined}
                      />
                  </div>
                }
                { // Don't render icon column if the field map is disabled
                  (!props.disabled || !props.disabledAdditions) &&
                  <div className={`fieldMapColumn__iconColumn`}>
                    {generateIcons(props.deleteCategory, props.addCategory)}
                  </div>
                }
              </div>
              {
                <React.Fragment>
                  <div className='fieldMapColumn__labelWrapper'>
                    <div className='row'>
                      <div className={`fieldMapColumn__iconColumn`}>
                        <MdDragHandle className={`fieldMapColumn__dragIcon fieldMapColumn__iconNotVisible`}/>
                      </div>
                      <div className='column'>
                        <Label 
                          className={'fieldMapColumn__label'} 
                          text={props.labels && props.labels.target ? props.labels.target : 'Input'}
                        />
                      </div>
                      <div className='column'>
                        <Label 
                          className={'fieldMapColumn__label'} 
                          text={props.labels && props.labels.output ? props.labels.output : 'Output'}
                        />
                      </div>
                      <div className={`fieldMapColumn__iconColumn`}>
                        <MdAddCircle className={`fieldMapColumn__addIcon fieldMapColumn__iconNotVisible`}/>
                      </div>
                    </div>
                  </div>
                  {
                    // The items that appear in the list of draggable rows
                    props.children
                  }
              </React.Fragment>
              }
            </div>
          )}
      </Draggable>
  );
}));
