import * as React from "react"
import { Dialog } from "@headlessui/react"

const DialogConfirm = ({ is_open, set_isopen, message, primary_color }) => {
  return (
    <Dialog
      open={is_open}
      onClose={() => {/* prevent */}}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded w-full md:w-1/3 mx-8 md:mx-auto py-4 px-6">
          <Dialog.Title className={`text-2xl text-${primary_color}-600 mb-4`}>{ message }</Dialog.Title>
          <p className="mb-4">Would you like to restart the game?</p>
          <div className="flex flex-shrink justify-end">
          	<button onClick={e => {
          		location.reload()
          	}} className={`inline-flex bg-${primary_color}-600 text-white rounded-full h-8 w-1/4 mr-4 px-4 justify-center items-center`}>Yes</button>
          	<button onClick={e => {
          		set_isopen(false)
          	}} className={`inline-flex bg-white text-${primary_color}-600 border-2 border-${primary_color}-600 rounded-full h-8 w-1/4 px-4 justify-center items-center`}>No</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default DialogConfirm