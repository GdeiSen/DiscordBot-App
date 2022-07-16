
function test(testers) {
    let state = true;
    testers.some((tester) => {
        if (tester > 1) { state = tester; return true }
    })
    return state;
}

console.log(test([1, 1, 1, 1]))