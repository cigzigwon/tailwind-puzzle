import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"

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
	const [swept, set_swept] = useState([])
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
			  accept: '#yes-drop',
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
			    // dropzoneElement.textContent = ' '
			    dropzoneElement.classList.add('dropped')
			    dropzoneElement.classList.remove('bg-blue-400')

			    if (!dropzoneElement.classList.contains('bg-gray-300')) {
			    	set_swept(prev => prev.concat([[parseInt(dropzoneElement.getAttribute('data-x')), parseInt(dropzoneElement.getAttribute('data-y'))]]))
			    }

			    if (dropzoneElement.classList.contains('xxx')) {
			    	dropzoneElement.classList.add('bg-red-400')
			    	dropzoneElement.classList.remove('xxx')
			    	set_blasts(prev => ++prev)
			    } else {
			    	dropzoneElement.classList.add('bg-gray-300')
			    }
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
			}, 400)
		}
	}, [blasts])

	useEffect(() => {
		if (swept.length >= ((x_set.length * y_set.length) - (mines.length - blasts))) {
			setTimeout(() => {
				alert("YOU WIN! CONGRATS!")
				location.reload()
			}, 400)
		}
	}, [swept])

	return (
		<>
			<div id="yes-drop" className="drag-drop h-8 w-8 bg-yellow-800"></div>
			<div className="container mt-24 mx-auto px-6 md:w-1/3">
				<h1 className="mb-6 text-3xl">DnD Mine Sweeper</h1>
				{grid.map((y, y_key) => (
					<div key={y_key} className="flex flex-row">
					  {y.map((x, x_key) => {
					  	const found = mines.find(([x, y]) => (x == x_key && y == y_key))
					  	const classes = "dropzone inline-flex flex-grow items-center justify-center p-4 m-1 bg-blue-400" + (found ? " xxx" : "")

					  	return (
						  	<div key={x_key} data-x={x_key} data-y={y_key} className={classes}><span>&nbsp;</span></div>
						  )
					  })}
					</div>
				))}
			</div>
		</>
	)
}

ReactDOM.render(<App />, document.querySelector("#root"))