'use strict'

import { FULL_W, FULL_H } from '../state';

/*
  MakeElements --- 
    MakeElement.createEle : Creates HTML element of your choosing
                            
                            Type: Takes string value, can create any element type ie "div", "span","img"
                            Name: Takes string value, sets element Id value
                            Gridsize: Takes Array value, [xs,sm,md,lg]. Used for bootstrap's grid system
                            Custom: Takes string value, sets custom classes
                                    Uses an array if there is more than one custom class being called in.
                                    

*/

export function MakeElement(){     
  this.createEle = function(type,name,gridsize,custom) {
    let newElement = document.createElement(type); 
        newElement.id = name;
    
    let classStuff = ['noPadding']; 

    if(Array.isArray(custom)) {
      custom.forEach(function(clas){
        classStuff.push(clas);
      })
    } else {
      classStuff.push(custom);
    }

    if (gridsize) {

      gridsize.forEach(function(siz,i){
        let multiSize = ['xs','sm','md','lg'];
        if(parseInt(siz) == 0) {
          classStuff.push(`hidden-${multiSize[i]}`);
        } else {
          classStuff.push(`col-${multiSize[i]}-${siz}`);
        }
      })
    } else {
      classStuff.push('noBootstrap');
    }

    classStuff.forEach(function(clas){
      newElement.classList.add(clas);
    }); 
    return newElement;
  }
}

export function displayGrid(gridArray, gridSize, lockRowHeight) {
  let wAdd = Math.ceil(FULL_W / gridSize);
  let totalRows = Math.ceil(gridArray.length / gridSize);
  let rowHeight = lockRowHeight ? lockRowHeight : Math.ceil(FULL_H / totalRows);
  let lastRowCount = gridArray.length % gridSize || gridSize;
  let lastWAdd = Math.ceil(FULL_W / lastRowCount);

  gridArray.forEach((gri, i) => {
    let heightCount = Math.floor(i / gridSize) + 1;
    let colIndex = i % gridSize;
    let isLastRow = heightCount === totalRows;
    let width = isLastRow ? lastWAdd : wAdd;

    gri.height = rowHeight;
    gri.yPosition = (heightCount - 1) * rowHeight;
    gri.xPosition = colIndex * width;
    gri.width = width;
  })

  return gridArray;
}