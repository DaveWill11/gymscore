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
    const row = button.closest("[data-skill-selector-row]").dataset.skillSelectorRow
  
    // If the same button is clicked again, undo the selection
    if (this.rowSelections[row] === value) {
      delete this.rowSelections[row]
      this.totalSelected -= value
    } else {
      // Otherwise, update the selection in that row
      // First, subtract previous value if there was one
      if (this.rowSelections[row] !== undefined) {
        this.totalSelected -= this.rowSelections[row]
      }
  
      // Check if the new value would exceed the limit
      if (this.totalSelected + value > 8) return
  
      this.rowSelections[row] = value
      this.totalSelected += value
    }
  
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
