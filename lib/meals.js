import sql from "better-sqlite3";

const db = sql("meals.db");

// export function getMeals() {
//   return db.prepare("SELECT * FROM meals").all();
// }
// it doesn't need the async, await and promise, we use it here for practice waiting a response

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  //this error is just to test the error handling:
  //throw new Error("Loading meals failed");

  return db.prepare("SELECT * FROM meals").all();
}
