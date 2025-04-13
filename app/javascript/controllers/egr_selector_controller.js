import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["button"]

    connect() {
        this.groupSelections = {}
        this.totalSelected = 0
        console.log("EGR controller started")
    }

    select(event) {
        const button = event.target
        const value = parseFloat(button.textContent)
        const groupElement = button.closest("[data-egr-selector-group]")
        const group = groupElement.dataset.egrSelectorGroup
      
        const previousValue = this.groupSelections[group]
      
        if (previousValue === value) {
          // Deselect
          delete this.groupSelections[group]
          this.totalSelected -= value
      
          // Re-enable all buttons in this group
          groupElement.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("bg-yellow-600", "bg-gray-600")
            btn.classList.add("bg-green-500")
            btn.disabled = false
          })
      
          this.updateEGRTotal()
          return
        }
      
        // New selection
        this.groupSelections[group] = value
        this.totalSelected = this.totalSelected - (previousValue || 0) + value
      
        // Disable other buttons in the group and apply styles
        groupElement.querySelectorAll("button").forEach(btn => {
            const btnValue = parseFloat(btn.textContent)
          
            if (btnValue === value) {
              btn.classList.add("bg-yellow-600")
              btn.classList.remove("bg-gray-600", "bg-green-500")
              btn.disabled = false
            } else {
              btn.classList.remove("bg-yellow-600", "bg-green-500")
              btn.classList.add("bg-gray-600")
              btn.disabled = true
            }
          })
          
      
        this.updateEGRTotal()
      }
      
      

      updateEGRTotal() {
        let total = 0.0
        for (const [_, value] of Object.entries(this.groupSelections)) {
            total += value
        }
        const display = document.getElementById("egr-total")
        if (display) {
            display.textContent = total.toFixed(1)
        }
        window.dispatchEvent(new Event("score:updated"))
      }
}