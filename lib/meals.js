import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";

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

export function getMeal(slug) {
  return db.prepare("SELECT * FROM  meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(
    Buffer.from(bufferedImage, (error) => {
      if (error) {
        throw new Error("Saving image failed.");
      }
    })
  );

  meal.image = `/images/${fileName}`;

  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `
  ).run(meal);
}
