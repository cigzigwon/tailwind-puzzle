import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { EyeIcon, ArrowsExpandIcon } from '@heroicons/react/outline'

import '../sass/styles.sass'

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

var x_set = [0, 1, 2, 3, 4, 5]
var y_set = Array.from(x_set)

const max_mines = 8
const grid = Array.from(x_set).fill(Array.from(y_set).fill(0))
const mines = new Array(max_mines).fill().reduce((prev, curr) => {
	const x_key = getRandomInt(x_set.length)
	const y_key = getRandomInt(y_set.length)
	const x = x_set[x_key]
	const y = y_set[y_key]

	if (prev.find(([a, b]) => a == x && b == y)) {
		return prev
	}

	return prev.concat([[x, y]])
}, [])

const App = () => {
	const [blasts, set_blasts] = useState(0)
	const [swept, set_swept] = useState(0)
	const dragMoveListener = (event) => {
	  var target = event.target
	  // keep the dragged position in the data-x/data-y attributes
	  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
	  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

	  // translate the element
	  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

	  // update the posiion attributes
	  target.setAttribute('data-x', x)
	  target.setAttribute('data-y', y)
	}

	// this function is used later in the resizing and gesture demos
	window.dragMoveListener = dragMoveListener

	useEffect(() => {
		import("interactjs").then(({ default: interact }) => {
		  /* The dragging code for '.draggable' from the demo above
			 * applies to this demo as well so it doesn't have to be repeated. */

			// enable draggables to be dropped into this
			interact('.dropzone').dropzone({
			  // only accept elements matching this CSS selector
			  accept: '#sweeper',
			  // Require a 75% element overlap for a drop to be possible
			  overlap: 0.75,

			  // listen for drop related events:

			  ondropactivate: function (event) {
			    // add active dropzone feedback
			    event.target.classList.add('drop-active')
			  },
			  ondragenter: function (event) {
			    var draggableElement = event.relatedTarget
			    var dropzoneElement = event.target

			    // feedback the possibility of a drop
			    dropzoneElement.classList.add('drop-target')
			    draggableElement.classList.add('can-drop')
			    // draggableElement.textContent = ' '
			  },
			  ondragleave: function (event) {
			    // remove the drop feedback style
			    event.target.classList.remove('drop-target')
			    event.relatedTarget.classList.remove('can-drop')
			    // event.target.classList.remove('dropped')
			    // event.relatedTarget.textContent = ' '
			  },
			  ondrop: function (event) {
			  	var dropzoneElement = event.target


			    if (dropzoneElement.classList.contains('xxx')) {
			    	dropzoneElement.innerHTML = '💣'
			    	dropzoneElement.classList.add('bg-red-400')
			    	dropzoneElement.classList.remove('xxx')
			    	set_blasts(prev => prev + 1)
			    } else {
			    	dropzoneElement.classList.add('bg-gray-300')
			    	dropzoneElement.innerHTML = '✅'
			    }
			    
			  	if (dropzoneElement.classList.contains('bg-blue-400')) {
			  		set_swept(prev => prev + 1)
			  	}

			    dropzoneElement.classList.add('dropped')
			    dropzoneElement.classList.remove('bg-blue-400')
			  },
			  ondropdeactivate: function (event) {
			    // remove active dropzone feedback
			    event.target.classList.remove('drop-active')
			    event.target.classList.remove('drop-target')
			  }
			})

			interact('.drag-drop')
			  .draggable({
			    inertia: true,
			    modifiers: [
			      interact.modifiers.restrictRect({
			        restriction: 'parent',
			        endOnly: true
			      })
			    ],
			    autoScroll: true,
			    // dragMoveListener from the dragging demo above
			    listeners: { move: dragMoveListener }
			  })
		})
	}, [])

	useEffect(() => {
		if (blasts >= mines.length) {
			setTimeout(() => {
				alert("YOU LOSE")
				location.reload()
			}, 200)
		}
	}, [blasts])

	useEffect(() => {
		if (swept >= (x_set.length * y_set.length - 1) && blasts < mines.length) {
			setTimeout(() => {
				alert("YOU WIN! CONGRATS!")
				location.reload()
			}, 200)
		}
	}, [swept])

	return (
		<>
			<div id="sweeper" className="drag-drop h-8 w-8 bg-purple-600 flex items-center justify-center">
				<EyeIcon className="h-4/5 w-4/5 text-white text-center" />
			</div>
			<div className="container mt-24 px-4 mx-auto w-full md:w-3/5 lg:w-1/3">
				<h1 className="mb-6 text-3xl">DnD Mine Sweeper</h1>
				<p className="mb-6">Drag and drop the eye icon to uncover the booby traps, you booby!</p>
				{grid.map((y, y_key) => (
					<div key={y_key} className="flex flex-row">
					  {y.map((x, x_key) => {
					  	const found = mines.find(([x, y]) => (x == x_key && y == y_key))
					  	const classes = "dropzone inline-flex flex-grow items-center justify-center p-2 lg:p-4 m-1 bg-blue-400" + (found ? " xxx" : "")

					  	return (
						  	<div key={x_key} data-x={x_key} data-y={y_key} className={classes}>❓</div>
						  )
					  })}
					</div>
				))}
			</div>
		</>
	)
}

ReactDOM.render(<App />, document.querySelector("#root"))