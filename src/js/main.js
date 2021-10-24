import React, { useEffect, useState } from "react"
import { Dialog } from "@headlessui/react"
import ReactDOM from "react-dom"
import { EyeIcon, ArrowsExpandIcon } from "@heroicons/react/outline"

import '../sass/styles.sass'

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

var x_set = [0, 1, 2, 3, 4, 5]
var y_set = Array.from(x_set)

const colors = ['green', 'blue', 'pink', 'purple', 'pink', 'indigo', 'yellow']
const primary_color = colors[getRandomInt(colors.length)]
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

const DialogConfirm = ({ isOpen, setIsOpen, message }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {/* prevent */}}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded w-full md:w-1/3 mx-8 md:mx-auto py-4 px-6">
          <Dialog.Title className="text-2xl mb-4">{ message }</Dialog.Title>
          <p className="mb-4">Would you like to restart?</p>
          <div className="flex flex-shrink justify-end">
          	<button onClick={e => {
          		location.reload()
          	}} className={`inline-flex bg-${primary_color}-600 text-white rounded-full h-8 w-1/4 mr-4 px-4 justify-center items-center`}>Yes</button>
          	<button onClick={e => {
          		setIsOpen(false)
          	}} className={`inline-flex bg-white text-${primary_color}-600 border-2 border-${primary_color}-600 rounded-full h-8 w-1/4 px-4 justify-center items-center`}>No</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

const App = () => {
	const [game_state, set_game_state] = useState({
		message: "Hello!",
	})
	const [is_open, set_isopen] = useState(false)
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
			    dropzoneElement.classList.add(`bg-${primary_color}-600`)
			    draggableElement.classList.add('can-drop')
			    // draggableElement.textContent = ' '
			  },
			  ondragleave: function (event) {
			    // remove the drop feedback style
			    event.target.classList.remove('drop-target')
			    event.target.classList.remove(`bg-${primary_color}-600`)
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
			    
			  	if (dropzoneElement.classList.contains(`bg-${primary_color}-400`)) {
			  		set_swept(prev => prev + 1)
			  	}

			    dropzoneElement.classList.add('dropped')
			    dropzoneElement.classList.remove(`bg-${primary_color}-400`)
			  },
			  ondropdeactivate: function (event) {
			    // remove active dropzone feedback
			    event.target.classList.remove('drop-active')
			    event.target.classList.remove('drop-target')
			    event.target.classList.remove(`bg-${primary_color}-600`)
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
			set_game_state({ message: "You Lose!!!" })
			set_isopen(true)
		}
	}, [blasts])

	useEffect(() => {
		if (swept >= (x_set.length * y_set.length - 1) && blasts < mines.length) {
			set_game_state({ message: "You Win!!! Congrats!!" })
			set_isopen(true)
		}
	}, [swept])

	return (
		<>
			<div id="sweeper" className="drag-drop h-8 w-8 bg-gray-900 flex items-center justify-center">
				<EyeIcon className="h-4/5 w-4/5 text-white text-center" />
			</div>
			<div className="container mt-24 px-4 mx-auto w-full md:w-3/5 lg:w-1/3">
				<h1 className="mb-6 text-3xl">DnD Mine Sweeper</h1>
				<p className="mb-6">Drag and drop the eye icon to uncover the booby traps (mines), you booby! There are <strong className={`font-semibold text-${primary_color}-500`}>{mines.length}</strong> of them.</p>
				{grid.map((y, y_key) => (
					<div key={y_key} className="flex flex-row">
					  {y.map((x, x_key) => {
					  	const found = mines.find(([x, y]) => (x == x_key && y == y_key))
					  	const classes = `dropzone inline-flex flex-grow items-center justify-center p-2 lg:p-4 m-1 bg-${primary_color}-400` + (found ? " xxx" : "")

					  	return (
						  	<div key={x_key} data-x={x_key} data-y={y_key} className={classes}>❓</div>
						  )
					  })}
					</div>
				))}
			</div>
			<DialogConfirm isOpen={is_open} setIsOpen={set_isopen} {...game_state} />
		</>
	)
}

ReactDOM.render(<App />, document.querySelector("#root"))