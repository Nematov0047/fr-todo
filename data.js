class Data {
    constructor(dbName) {
        if (!localStorage.getItem(dbName)) {
            localStorage.setItem(dbName, JSON.stringify([]));
        }
        this.dbName = dbName;
    }

    select() {
        return JSON.parse(localStorage.getItem(this.dbName));
    }

    update(newDb) {
        try {
            let currentData = this.select();
            console.log(newDb);
            let updatedData = currentData.map(item => {
                if (item.id == newDb.id) {
                    console.log(newDb?.check || item?.check);
                    item.check = newDb?.check || item?.check;
                    console.log(newDb?.title || item?.title);
                    item.title = newDb?.title || item?.title;
                }
                return item;
            });
            this.insert(updatedData);
        } catch (error) {
            return error;
        }
    }

    insert(newDb) {
        localStorage.setItem(this.dbName, JSON.stringify(newDb))
    }

    append(newObj) {
        let currentData = this.select();
        currentData.push(newObj);
        this.insert(currentData);
    }

    remove(id) {
        let currentData = this.select();
        currentData = currentData.filter(item => item.id == id ? false : true);
        this.insert(currentData);
    }
}