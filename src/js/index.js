import ReactDOM from "react-dom"
import * as React from "react"
import App from "./App"
import Cookies from "js-cookie"
import moment from "moment"

const app_name = 'dnd-minesweep'

const boot = () => {
	const cookie = Cookies.get(app_name)

	if (undefined === cookie) {
		const day = moment().day()
		const expiry_moment = day >= 5 ? moment().add((7 - day) + 5, 'd') : moment().add(5 - day, 'd')
		const expiry_date = expiry_moment.hour(23).minute(0).second(0).toDate()

		localStorage.removeItem('score')
		Cookies.set(app_name, expiry_date.toString(), {
			expires: expiry_date
		})
	} else {
		console.log(`[${app_name}] game expires on:`, cookie)
	}
}

boot()
ReactDOM.render(<App />, document.querySelector("#root"))