class PerformanceCalculator {
    constructor(aPerformance) {
        this.aPerformance = aPerformance;
    }

    get amount() {
        throw new Error(`unknown type: ${this.aPerformance.play.type}`);
    }

    get volumeCredits() {
        return Math.max(this.aPerformance.audience - 30, 0);
    }
}

class tragedyPerformanceCalculator extends PerformanceCalculator {
    get amount() {
        let result;
        result = 40000;
        if (this.aPerformance.audience > 30) {
            result += 1000 * (this.aPerformance.audience - 30);
        }
        return result;
    }
}

class comedyPerformanceCalculator extends PerformanceCalculator {
    get amount() {
        let result;
        result = 30000;
        if (this.aPerformance.audience > 20) {
            result += 10000 + 500 * (this.aPerformance.audience - 20);
        }
        result += 300 * this.aPerformance.audience;
        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.aPerformance.audience / 5);
    }
}

function createPerformanceCalculator(aPerformance) {
    switch (aPerformance.play.type) {
        case 'tragedy':
            return new tragedyPerformanceCalculator(aPerformance);
        case 'comedy':
            return new comedyPerformanceCalculator(aPerformance);
        default:
            throw new Error(`unknown type: ${aPerformance.play.type}`);
    }
}

export function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        const result = Object.assign({play: playFor(aPerformance)}, aPerformance);
        const calculator = createPerformanceCalculator(result);
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalVolumeCredits(data) {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.volumeCredits;
        }
        return result;
    }

    function totalAmount(data) {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.amount;
        }
        return result;
    }
}