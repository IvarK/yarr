function addQuarks(amount) {
    const save = JSON.parse(atob(localStorage.getItem("save")))
    save.strange[0].current += amount;
    save.strange[0].total += amount;

    localStorage.setItem("save", btoa(JSON.stringify(save)))
}