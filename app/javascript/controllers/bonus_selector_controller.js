import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button"]

  connect() {
    this.selectedValue = null
  }

  select(event) {
    const clickedButton = event.currentTarget
    const value = parseFloat(clickedButton.textContent)
    
    if (this.selectedValue === value) {
        // Deselect
        this.selectedValue = null
        this.buttonTargets.forEach(button => {
          button.classList.remove("bg-red-600", "bg-gray-600")
          button.classList.add("bg-purple-500")
          button.disabled = false
        })
        this.updateTotal()
        return
      }
    this.selectedValue = value

    this.buttonTargets.forEach(button => {
      if (button === clickedButton) {
        button.classList.remove("bg-purple-500", "bg-gray-600")
        button.classList.add("bg-red-600")
        button.disabled = false
      } else {
        button.classList.remove("bg-red-600", "bg-purple-500")
        button.classList.add("bg-gray-600")
        button.disabled = true
      }
    })

    this.updateTotal()
  }

  updateTotal() {
    const totalDisplay = document.getElementById("cv-bonus-total")
    if (totalDisplay) {
      totalDisplay.textContent = this.selectedValue !== null
        ? this.selectedValue.toFixed(1)
        : "0.0"
    }
  }
  
}
