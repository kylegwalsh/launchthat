import * as React from 'react';
const { PureComponent, createRef } = React;
export { PureComponent }; 
import { FieldMapRow, FieldMapRowDraggable, FieldMapColumn } from './components';
import './FieldMapList.scss';
import { DragDropContext, Droppable, DroppableProvided, DraggableLocation, DropResult, DroppableStateSnapshot } from 'react-beautiful-dnd';

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
 * Properties required for field map object
 */
interface IFieldMap {
  /**
   * value to search for and replace with output
   */
  id: number;
  /**
   * value to search for and replace with output
   */
  target: string;
  /**
   * value to map input to
   */
  output: string;
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
   * what possible options to allow as the targets (usually array of approved fields)
   */
  options?: IReactSelectOption[];
  /**
   * whether field map should allow for a nested categories / draggable version of the field map
   */
  useCategories?: boolean;
  /**
   * errors for each input
   */
  errors?: any;
  /**
   * Labels for the categories
   */
  labels?: {
    target: string;
    output: string;
  };
  /**
   * whether a user can edit a field map
   */
  disabled?: boolean;

  /**
   * Whether a user can add or remove items from the fieldmap
   */
  disableAdditions?: boolean;
  /**
   * Determines whether or not the values should be automatically filled in the ouput
   */
  autofillOff?: boolean;
}

/**
 * A list of field map rows
 */
export class FieldMapList extends PureComponent<IProps> {
  state = {
    fieldMap: [] as IFieldMap[],
    refs: [] as any,
    count: 0,
    options: this.props.options,
  };

  /**
   * Function used by parent to init the field map in this component
   */
  initFieldMap = (initialFieldMap: IFieldMap[]) => {
    if (this.props.useCategories) {
      const newFieldMap = [] as any;
      const refs: any[] = [];
      let count = 0;

      initialFieldMap.forEach((map) => {
        // Get the category name
        const mapName = Object.keys(map)[0];
        // Create an array to store the refs of the fields
        const fieldsRefs: any = [];
        // Create a fields array
        const fields = [];

        for (const field of Object.values(map)[0]) {
          fields.push({
            id: count++,
            ...field,
          });
          // Create new reference for this field map row
          fieldsRefs.push(createRef());
        }
        // Push an empty row for the selection
        if (!this.props.disabled && !this.props.disableAdditions) {
          fields.push({
            id: count++,
            target: ``,
            output: '',
          });
        }
        // Push on the updated fields to out field map
        newFieldMap.push({
          [ mapName ] : fields,
          id: count++,
        });
        // Create a ref map that is the same as the updated field map
        refs.push({
          [mapName] : fieldsRefs,
          ref: createRef(),
        });
      });

      if (!this.props.disabled && !this.props.disableAdditions) {
        // Push on a blank category and category ref
        newFieldMap.push({ [ `blank_row${count + 1}` ] : [{ id: count++, target: `${count - 1}`, output: '' }], id: count++ });
        refs.push({ [`blank_row${count - 1}` ] : [], ref: createRef() });
      }
      
      this.setState({ 
        fieldMap: newFieldMap,
        count,
        refs,
      });
    } else {
      const newFieldMap = initialFieldMap.slice();
      const refs: any[] = [];
      let count = 0;
      newFieldMap.forEach((map) => {
        // Assign id
        map.id = count++;
        // Create new reference for this field map row
        refs.push(createRef());
      });
  
      if (!this.props.disabled && !this.props.disableAdditions) {
        // Add empty row to end
        newFieldMap.push({
          id: count++,
          target: '',
          output: '',
        });
      }
  
      this.setState({ 
        fieldMap: newFieldMap,
        count,
        refs,
      });
    }    
  }

  /**
   * @param result - The result object of the drag and drop
   */
  onDragEnd = (result: DropResult) => {
    const temp = this.state.fieldMap.slice(0);
    const tempRefs = this.state.refs.slice(0);

    // dropped nowhere
    if (!result.destination) {
      return;
    }
    // The value for the source and destination from react beautiful dnd
    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering column
    if (result.type === 'COLUMN') {
      const reordered = this.reorder(temp, source.index, destination.index);
      const reorderedRefs = this.reorder(tempRefs, source.index, destination.index);
      this.setState({ fieldMap: reordered, refs: reorderedRefs });
      return;
    }
    // Create a reordered field maps
    const reordered = this.reorderFieldMap(temp, source, destination);
    const reorderedRefs = this.reorderFieldMap(tempRefs, source, destination, true);
    this.setState({ fieldMap: reordered, refs: reorderedRefs });
  }

  /**
   * @param fieldMap - The fieldMap/refs we want to reorder
   * @param source - The source object from the react beautiful dnd
   * @param destination - The destination object from the react beautiful dnd
   * @param refs - A boolean to determine if we are operating on refs
   */
  reorderFieldMap = (fieldMap: any, source: any, destination: any, refs?: boolean) => {
    // The array of the current field values
    let current: any[] = [];
    // Create a index to track the index of the current list inside of the fieldMap
    let currentIndex = -1;
    // Create an index to track the index of the next list inside of the fieldMap
    let nextIndex = -1;
    // An array of the next field values(Same as current if the lists are the same)
    let next: any[] = [];

    // Loop through the fieldmap to access the object values of the category for switching
    for (let i = 0; i < fieldMap.length; i++) {
      const categoryName = Object.keys(fieldMap[i])[0];
      if (categoryName === source.droppableId) {
        currentIndex = i;
        current = fieldMap[i][categoryName];
      } 
      if (categoryName === destination.droppableId) {
        nextIndex = i;
        next = fieldMap[i][categoryName];
      }
    }
    // Get the target draggable item we are operating on
    const target = current[source.index];

    // If you are dropping the items inside of the same list
    if (source.droppableId === destination.droppableId) {
      // Reorder the current list with the reorder function
      const reordered: any[] = this.reorder(
        current,
        source.index,
        destination.index,
      );

      let categoryObject;
      // If it's a ref set a special object
      if (refs) {
        // Create the object for the refs
        categoryObject = {
          [source.droppableId] : reordered,
          ref: fieldMap[currentIndex].ref,
        } as any;
      } else {
        // Create an new object with the reordered list
        categoryObject = {
          [source.droppableId] : reordered,
          id: fieldMap[currentIndex].id,
        } as any;
      }

      // Set the fieldmap with the current index equal to the new object
      fieldMap[currentIndex] = categoryObject;

      return fieldMap;
    }

    // Remove the target element from the current list
    current.splice(source.index, 1);
    // Add the target element to the next list
    next.splice(destination.index, 0, target);
    let categoryObjectCurrent;
    let categoryObjectNext;
    if (refs) {
      // Create a new category object to update the current list for refs
      categoryObjectCurrent = {
        [source.droppableId]: current,
        ref: fieldMap[currentIndex].ref,
      };
      // Create a new category object to update the next list for refs
      categoryObjectNext = {
        [destination.droppableId]: next,
        ref: fieldMap[nextIndex].ref,
      };
    } else {
      // Create a new category object to update the current list
      categoryObjectCurrent = {
        [source.droppableId]: current,
        id: fieldMap[currentIndex].id,
      };

      // Create a new category object to update the next list
      categoryObjectNext = {
        [destination.droppableId]: next,
        id: fieldMap[nextIndex].id,
      };
    }
    // Update the fieldMap
    fieldMap[currentIndex] = categoryObjectCurrent;
    fieldMap[nextIndex] = categoryObjectNext;

    return fieldMap;
  }

  /**
   * @param list - a list to reorder
   * @param startIndex - the index where the element is coming from
   * @param endIndex -  the index where the element should end
   */
  reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  /**
   * Retrieve all values for parent
   */
  retrieveFieldMap = () => {
    // Intialize a new field map
    const formattedFieldMap = [];
    // Check if you are using categories
    if (this.props.useCategories) {
      // Loop through the categories inside of the ref array
      for (const category of this.state.refs) {
        // Set the name of the category from the category object
        const categoryName = Object.keys(category)[0];
        // Intialize the new fields
        const formattedFields = [];
        // Loop through the refs inside of each category
        for (const ref of category[categoryName]) {
          formattedFields.push(ref.current.getValues());
        }

        // Set the new variables
        const categoryValue = category.ref.current.getValues().category;
        const idValue = category.ref.current.getValues().id;
        // Push on the formatted variables to the field map if the category is not empty and has children
        if (categoryValue !== '' || category[categoryName].length !== 0) {
          formattedFieldMap.push({
            [ categoryValue ] : formattedFields,
            id: idValue,
          });
        } 
      }

      return formattedFieldMap;
       
    } else {
      for (const ref of this.state.refs) {
        // @ts-ignore
        formattedFieldMap.push(ref.current.getValues());
      }
      console.log('Formatted in list', formattedFieldMap);
      return formattedFieldMap;      
    } 
  }

  /**
   * Generate field map rows
   */
  // @ts-ignore
  generateRows = () => {
    // Make sure field map is set
    if (this.state.fieldMap.length > 0) {
      // Return moveable category version
      if (this.props.useCategories) {
        // Use a short hand variable 
        const categories = this.state.fieldMap;
        // Set the length of the categories
        const categoriesLength = categories.length;
        return (
          <DragDropContext
            onDragEnd={this.onDragEnd}
          >
            <Droppable
              droppableId='board'
              type='COLUMN'
              direction='vertical'
            >
              {(provided: DroppableProvided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                {categories.map((category: any, catIndex: number) => {
                  // Set the category name
                  const categoryName = Object.keys(category)[0];

                  // Check for any errors in the category
                  let error;
                  if (this.props.errors) error = this.props.errors[category.id];
                  // Create the field map column that represents a category
                  return (
                  <FieldMapColumn
                    labels={this.props.labels}
                    index={catIndex}
                    key={category.id}
                    id={category.id}
                    error={error}
                    isDragDisabled={this.props.disabled || false}
                    disabled={this.props.disabled}
                    disabledAdditions={this.props.disableAdditions}
                    ref={this.state.refs[catIndex] ? this.state.refs[catIndex].ref : undefined}
                    category={categoryName}
                    deleteCategory={catIndex !== categoriesLength - 1 ? () => this.deleteCategory(catIndex) : undefined}
                    addCategory={catIndex === categoriesLength - 1 ? this.addCategory : undefined}
                  >
                    <Droppable
                      droppableId={categoryName === '' ? 'blank row' : categoryName}
                      type={'FIELDS'}
                    >
                    {(
                      dropProvided: DroppableProvided,
                      dropSnapshot: DroppableStateSnapshot,
                    ) => (
                      <div
                        className={`fieldMapList__wrapper ${dropSnapshot.isDraggingOver ? 'fieldMapList__wrapper--isDraggingOver' : ''}`}
                        {...dropProvided.droppableProps}
                      >
                        <div ref={dropProvided.innerRef}>
                          {
                            category[categoryName].map((row: any, index: number) => {
                              // Set the fields and determine there length
                              const fields = category[categoryName];
                              const fieldLength = fields.length;
                              // Check to see if the row should be draggable or not
                              let notDraggable = false;
                              if (index === fieldLength - 1) notDraggable = true;
                              // Check for errors of the field
                              let error;
                              if (this.props.errors) error = this.props.errors[row.id];
                              
                              return (
                                <FieldMapRowDraggable
                                  key={row.id}
                                  ref={this.state.refs[catIndex][categoryName][index]}
                                  disableAll={this.props.disabled}
                                  disabled={row.disabled}
                                  disableAdditions={this.props.disableAdditions}
                                  isDragDisabled={this.props.disabled || notDraggable}
                                  draggingOver={dropSnapshot.isDraggingOver}
                                  id={row.id}
                                  index={index}
                                  autofillOff={this.props.autofillOff}
                                  category={categoryName}
                                  target={row.target}
                                  output={row.output}
                                  errors={error}
                                  showLabel={index === 0}
                                  deleteRow={this.props.disabled ? undefined 
                                    : (index !== fieldLength - 1 ? () => this.deleteRow(index, categoryName) : undefined)}
                                  addRow={this.props.disabled ? undefined 
                                    : (index === fieldLength - 1 ? () => this.addRow(categoryName) : undefined)}
                                  options={this.props.options}
                                />
                              );
                            })
                          }
                          {dropProvided.placeholder}
                        </div>
                      </div>
                    )}
                    </Droppable>
                  </FieldMapColumn>
                  ); })}
                  {provided.placeholder}
              </div>
              )}
            </Droppable>
          </DragDropContext>
        );
      }
      // Return normal static version
      else {
        return this.state.fieldMap.map((row: IFieldMap, index: number) => {
          // Set any errors
          console.log('Tried to generate the field maps without categories');
          let error;
          if (this.props.errors) error = this.props.errors[row.id];
          
          return (
            <FieldMapRow
              key={row.id}
              ref={this.state.refs[index]}
              disableAll={this.props.disabled}
              disableAdditions={this.props.disableAdditions}
              disabled={row.disabled}
              id={row.id}
              labels={this.props.labels}
              target={row.target}
              autofillOff={this.props.autofillOff}
              output={row.output}
              errors={error}
              showLabel={index === 0}
              deleteRow={this.props.disabled ? undefined 
                : (index !== this.state.fieldMap.length - 1 ? () => this.deleteRow(index) : undefined)}
              addRow={this.props.disabled ? undefined : (index === this.state.fieldMap.length - 1 ? () => this.addRow() : undefined)}
              options={this.props.options}
            />
          );
        });
      }
    }
  }

  /**
   * Add a category to the field map
   */
  addCategory = () => {
    // Intialize placeholder variables
    const newFieldMap: any = this.state.fieldMap.slice();
    const newRefs: any = this.state.refs.slice();
    const newField = { id: this.state.count + 1, target: `${this.state.count + 1}`, output: '' };

    // Add an empty row with a blank row category name
    newFieldMap.push({
      [`blank_row${this.state.count + 2}`] : [newField],
      id: this.state.count + 2,
    });
    // Create the ref to match the new category
    newRefs.push({
      [`blank_row${this.state.count + 2}`]: [],
      ref: createRef(),
    });
    
    this.setState({ fieldMap: newFieldMap, refs: newRefs, count: this.state.count + 2 });
  }

  /**
   * A function that is used to remove a category
   * @param index - the index of the category that needs to be deleted
   */
  deleteCategory = (index: number) => {
    // Intialize placeholder variables
    const newFieldMap: any = this.state.fieldMap.slice();
    const newRefs: any = this.state.refs.slice();
    // Splice the category and the ref from there arrays
    newFieldMap.splice(index, 1);
    newRefs.splice(index, 1);

    this.setState({ fieldMap: newFieldMap, refs: newRefs });
  }

  /**
   * Function used to delete a row of data in the field map
   * @param index - which row to delete
   * @param category - The category which the row should be deleted from
   */
  deleteRow = (index: number, category?: string) => {
    // Check to see if we are using categories
    if (this.props.useCategories && category) {

      // Create placeholder variables
      const newFieldMap: any = this.state.fieldMap.slice();
      const newRefs: any = this.state.refs.slice();
      // Find the category by name and splice the result from the refs and categories
      for (let i = 0; i < newFieldMap.length; i++) {
        const categoryName: string = Object.keys(newFieldMap[i])[0];
        if (categoryName === category) {
          newFieldMap[i][category].splice(index, 1);
          newRefs[i][category].splice(index, 1);
        }
      }

      this.setState({ fieldMap: newFieldMap, refs: newRefs });
    } else {
      const newFieldMap = this.state.fieldMap.slice();
      const newRefs = this.state.refs;
  
      newFieldMap.splice(index, 1);
      newRefs.splice(index, 1);
  
      this.setState({ fieldMap: newFieldMap, refs: newRefs });
    }
  }

  /**
   * Add a row to either a category or just the field map if your not using categories
   * @param category - The category which the row should be added to
   */
  addRow = (category?: string) => {
    // Check to see if you are using categories
    if (this.props.useCategories) {
      // Create placeholder variables
      const newFieldMap: any = this.state.fieldMap.slice();
      const newRefs: any = this.state.refs.slice();

      // Find the category by name, add a new category and ref
      for (let i = 0; i < newFieldMap.length; i++) {
        // Set the category name for comparison
        const categoryName: string = Object.keys(newFieldMap[i])[0];
        if (categoryName === category) {
          // If the name matches the one we want to add to push a new row to the field map
          newFieldMap[i][category].push({
            id: this.state.count + 1,
            target: ``,
            output: '',
          });
          newRefs[i][category].push(createRef());
          this.setState({ fieldMap: newFieldMap, refs: newRefs, count: this.state.count + 1 });
          break;
        }
      }
    }
    else {
      const newFieldMap = this.state.fieldMap.slice();
      const newRefs = this.state.refs.slice();

      // Add empty row
      newFieldMap.push({
        id: this.state.count + 1,
        target: '',
        output: '',
      });

      // @ts-ignore
      newRefs.push(createRef());
      
      this.setState({ fieldMap: newFieldMap, refs: newRefs, count: this.state.count + 1 });
    }
  }

  render() {
    return (
      <div className={`row m-r-0 ${this.props.className ? this.props.className : ''}`}>
        <div className='column'>
            {this.generateRows()}
        </div>
      </div>
    );
  }
}