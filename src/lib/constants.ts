export const ALL_GENRES = [
  "Action",
  "Adaptation",
  "Adult",
  "Adventure",
  "Comedy",
  "Cooking",
  "Crime",
  "Demon",
  "Demons",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Fight",
  "Game",
  "Gender Bender",
  "Harem",
  "Historical",
  "Horror",
  "Isekai",
  "Josei",
  "Latest",
  "Love",
  "Magic",
  "Martial Arts",
  "Mature",
  "Mecha",
  "Medical",
  "Murim",
  "Mystery",
  "Philosophical",
  "Psychological",
  "Regression",
  "Revenge",
  "Romance",
  "School Life",
  "Sci-fi",
  "Seinen",
  "Shoujo",
  "Shounen",
  "Slice of Life",
  "Smut",
  "Sports",
  "Supernatural",
  "Supranatural",
  "Thriller",
  "Tragedy",
  "Violence",
  "Wuxia",
];

export function genreToSlug(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

