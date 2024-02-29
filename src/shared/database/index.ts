export abstract class Database {
    protected table = ""

    async insert(itemToAdd: any) {
        try {
            return itemToAdd
        } catch (e) {
            throw new Error("Error in insert query.")
        }
    }
}