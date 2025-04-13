import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["span"]

    connect() {
        this.totalScore = 0.0
        console.log("Total controller started")
        window.addEventListener("score:updated", () => {
            this.calculateTotal()
        })
    }

    //function to calculate sum (combine with above function?)
    calculateTotal() {
        const skillTotal = parseFloat(document.getElementById("skills-total")?.textContent || 0)
        const egrTotal = parseFloat(document.getElementById("egr-total")?.textContent || 0)
        const bonusTotal = parseFloat(document.getElementById("cv-bonus-total")?.textContent || 0)

        this.totalScore = skillTotal + egrTotal + bonusTotal
        this.updateTotal()
    }

    updateTotal() {
        const totalDisplay = document.getElementById("total-score")
        if(totalDisplay) {
            totalDisplay.textContent = this.totalScore.toFixed(1)
        }
    }
}