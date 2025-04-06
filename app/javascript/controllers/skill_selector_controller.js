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

    if(this.rowSelections[row] !== undefined) return

    if(this.totalSelected + value > 8) return

    this.rowSelections[row] = value
    this.totalSelected += value


    button.classList.add("bg-green-600")
    button.disabled = false

    const rowButtons = button.closest("[data-skill-selector-row]").querySelectorAll("button")
    rowButtons.forEach(btn => {
        if (btn !== button){
            btn.disabled = true
        }
    })
    this.updateAllButtons()
    this.updateSkillTotal()
  }

  updateAllButtons() {
    const buttons = this.buttonTargets
    buttons.forEach(button => {
        const row = button.closest("[data-skill-selector-row]").dataset.skillSelectorRow

        if(this.rowSelections[row] !== undefined) return

        const value = parseInt(button.textContent)
        button.disabled = this.totalSelected + value > 8
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
