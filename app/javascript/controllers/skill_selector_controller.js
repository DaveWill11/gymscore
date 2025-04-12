import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button"]

  connect() {
    this.totalSelected = 0
    this.rowSelections = {} //Track selections per row
    console.log("Stimulus controller started")
  }

  select(event) {
    const button = event.target
    const value = parseInt(button.textContent)
    const rowElement = button.closest("[data-skill-selector-row]")
    const row = rowElement.dataset.skillSelectorRow

    // Check if this button is already selected for the row
  if (this.rowSelections[row] === value) {
    delete this.rowSelections[row]
    this.totalSelected -= value
    this.updateAllButtons()
    this.updateSkillTotal()
    return
  }
  
    const previousValue = this.rowSelections[row]
  
    // Calculate new total if switching selection
    const newTotal = this.totalSelected - (previousValue || 0) + value
  
    if (newTotal > 8) return
  
    // Update selections
    this.totalSelected = newTotal
    this.rowSelections[row] = value
  
    // Update button styles and states
    const rowButtons = rowElement.querySelectorAll("button")
    rowButtons.forEach(btn => {
      const btnValue = parseInt(btn.textContent)
      if (btn === button) {
        btn.classList.add("bg-green-600")
        btn.classList.remove("bg-gray-600")
      } else {
        btn.classList.remove("bg-green-600")
        if (btnValue + this.totalSelected - value > 8) {
          btn.disabled = true
        } else {
          btn.disabled = false
        }
  
        if (this.rowSelections[row] !== undefined) {
          btn.classList.add("bg-gray-600")
        } else {
          btn.classList.remove("bg-gray-600")
        }
      }
    })
  
    this.updateAllButtons()
    this.updateSkillTotal()
  }
  
  updateAllButtons() {
    const buttons = this.buttonTargets
  
    buttons.forEach(btn => {
      const row = btn.closest("[data-skill-selector-row]").dataset.skillSelectorRow
      const value = parseInt(btn.textContent)
  
      // Skip this row — we already updated buttons there
      if (this.rowSelections[row] !== undefined) {
        if(this.rowSelections[row] === value) {
          btn.classList.add("bg-green-600")
          btn.classList.remove("bg-gray-600")
          btn.disabled = false
        } else {
          btn.classList.add("bg-gray-600")
          btn.classList.remove("bg-green-600")
          btn.disabled = false //Can change mind within row
        }
      } else {
        if(this.totalSelected + value > 8) {
          btn.disabled = true
          btn.classList.add("bg-gray-600")
          btn.classList.remove("bg-green-600")
        } else {
          btn.disabled = false
          btn.classList.remove("bg-gray-600", "bg-green-600")
        }
      }
    })
  }
  

  updateSkillTotal() {
    let total = 0.0
    for (const [level, count] of Object.entries(this.rowSelections)) {
        const skillValue = this.skillLetterToValue(level)
        total += skillValue * count
    }
    const display = document.getElementById("skills-total")
    if (display) {
        display.textContent = total.toFixed(1)
    }
  }

  skillLetterToValue(letter) {
    const letterCode = letter.toUpperCase().charCodeAt(0)
    const baseCode = 'A'.charCodeAt(0)
    const index = letterCode - baseCode
    return (index + 1) * 0.1
  }
}
