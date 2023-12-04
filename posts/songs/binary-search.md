## title: Binary Search

Binary Search

## What is Binary Search?

Binary search is a search algorithm that finds the position of a target value within a sorted array. Binary search compares the target value to the middle element of the array. If they are not equal, the half in which the target cannot lie is eliminated and the search continues on the remaining half, again taking the middle element to compare to the target value, and repeating this until the target value is found. If the search ends with the remaining half being empty, the target is not in the array.

## Binary Search in TypeScript

```typescript
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

## Binary Search in Song

[Chorus]

Binary Search

Takes logaritmic time

Runs recursively, from the middle i

And there you'll find

[Verse]

If the target element is equal to the current, return the index

And if the target element is less than the current, search the left half

And if the target element is greater than the current, search the right half

Until you find the target element, or return not found

[Chorus]

Binary Search

Takes logaritmic time

Runs recursively, from the middle i

And there you'll find
