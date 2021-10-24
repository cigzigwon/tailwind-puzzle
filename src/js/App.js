import React, { useEffect, useState } from "react"
import { EyeIcon, ArrowsExpandIcon } from "@heroicons/react/outline"
import DialogConfirm from "./DialogConfirm"

import '../sass/styles.sass'

const get_random_integer = (max) => {
  return Math.floor(Math.random() * max)
}

const max_mines = 8
const x_set = [0, 1, 2, 3, 4, 5]
const y_set = Array.from(x_set)
const colors = [
	'green',
	'blue',
	'pink',
	'purple',
	'pink',
	'indigo',
	'yellow'
]
const primary_color = colors[get_random_integer(colors.length)]
const grid = Array.from(x_set).fill(Array.from(y_set).fill(0))

const mine_generator = (prev, curr) => {
	const x_key = get_random_integer(x_set.length)
	const y_key = get_random_integer(y_set.length)
	const x = x_set[x_key]
	const y = y_set[y_key]

	if (prev.find(([a, b]) => a == x && b == y)) {
		return prev
	}

	return prev.concat([[x, y]])
}

const mines = new Array(max_mines).fill().reduce(mine_generator, [])

const App = () => {
	const [game_state, set_game_state] = useState({
		message: "",
	})
	const [is_open, set_isopen] = useState(false)
	const [blasts, set_blasts] = useState(0)
	const [swept, set_swept] = useState(0)
	const on_dragmove = event => {
	  const target = event.target
	  // keep the dragged position in the data-x/data-y attributes
	  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
	  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

	  // translate the element
	  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

	  // update the posiion attributes
	  target.setAttribute('data-x', x)
	  target.setAttribute('data-y', y)
	}

	// this function is used later in the resizing and gesture demos
	window.dragMoveListener = on_dragmove

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
			    const draggable_elem = event.relatedTarget
			    const dropzone_elem = event.target

			    // feedback the possibility of a drop
			    dropzone_elem.classList.add('drop-target')
			    dropzone_elem.classList.add(`bg-${primary_color}-600`)
			    draggable_elem.classList.add('can-drop')
			    // draggable_elem.textContent = ' '
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
			  	const dropzone_elem = event.target


			    if (dropzone_elem.classList.contains('xxx')) {
			    	dropzone_elem.innerHTML = '💣'
			    	dropzone_elem.classList.add('bg-red-400')
			    	dropzone_elem.classList.remove('xxx')
			    	set_blasts(prev => prev + 1)
			    } else {
			    	dropzone_elem.classList.add('bg-gray-300')
			    	dropzone_elem.innerHTML = '✅'
			    }
			    
			  	if (dropzone_elem.classList.contains(`bg-${primary_color}-400`)) {
			  		set_swept(prev => prev + 1)
			  	}

			    dropzone_elem.classList.add('dropped')
			    dropzone_elem.classList.remove(`bg-${primary_color}-400`)
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
				<h1 className={`mb-6 text-3xl text-${primary_color}-600`}>DnD Mine Sweeper</h1>
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
			<DialogConfirm is_open={is_open} set_isopen={set_isopen} primary_color={primary_color} {...game_state} />
		</>
	)
}

export default App