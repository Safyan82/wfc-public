export const compareAdvanceFilter = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false; // If arrays have different lengths, they are not equal
    }

    for (let i = 0; i < arr1.length; i++) {
        if (!arrayOfObjectsAreEqual(arr1[i], arr2[i])) {
            return false; // If any subarrays are not equal, the arrays are not equal
        }
    }

    return true; // If all subarrays are equal, the arrays are equal
}

function arrayOfObjectsAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false; // If subarrays have different lengths, they are not equal
    }

    for (let i = 0; i < arr1.length; i++) {
        const obj1 = arr1[i];
        const obj2 = arr2[i];

        // Assuming the objects have the same structure, you can compare their properties
        if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
            return false; // If any objects are not equal, the subarrays are not equal
        }
    }

    return true; // If all objects are equal, the subarrays are equal
}


// compare quick filters

export const compareQuickFilters = (obj1, obj2) => {
    // Check if both objects are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return obj1 === obj2; // If not objects, compare values directly
    }

    // Check if both objects are null
    if (obj1 === null && obj2 === null) {
        return true;
    }

    // Check if the number of keys is the same
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    // Compare each key and value recursively
    for (const key of keys1) {
        if (!keys2.includes(key) || !compareQuickFilters(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}



