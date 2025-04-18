export function getStatusColor(value: number, lowThreshold: number, highThreshold: number, isReversed = false): string {
    if (isReversed) {
      if (value < highThreshold) return "text-green-600"
      if (value < lowThreshold) return "text-amber-600"
      return "text-red-600"
    } else {
      if (value > highThreshold) return "text-green-600"
      if (value > lowThreshold) return "text-amber-600"
      return "text-red-600"
    }
  }
  