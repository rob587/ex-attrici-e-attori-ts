type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality:
    | "American"
    | "British"
    | "Australian"
    | "Israeli-American"
    | "South African"
    | "French"
    | "Indian"
    | "Israeli"
    | "Spanish"
    | "South Korean"
    | "Chinese";
};

function isActress(dati: unknown): dati is Actress {
  if (
    dati &&
    typeof dati === "object" &&
    "most_famous_movies" in dati &&
    Array.isArray((dati as any).most_famous_movies) &&
    "awards" in dati &&
    typeof (dati as any).awards === "string" &&
    "nationality" in dati &&
    typeof (dati as any).nationality === "string" &&
    "id" in dati &&
    typeof (dati as any).id === "number" &&
    "name" in dati &&
    typeof (dati as any).name === "string" &&
    "birth_year" in dati &&
    typeof (dati as any).birth_year === "number" &&
    "biography" in dati &&
    typeof (dati as any).biography === "string" &&
    "image" in dati &&
    typeof (dati as any).image === "string"
  ) {
    return true;
  }
  return false;
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
      throw new Error("formato dei dati non valido");
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error("errore durante il recupero");
    } else {
      console.error("errore sconosciuto", error);
    }
    return null;
  }
}

async function getAllActresses() {
  const response = await fetch(`http://localhost:3333/actresses`);
  if (response.ok) {
    const answer = await response.json();
    if (Array.isArray(answer)) {
      const actressValide = answer.filter((e) => isActress(e));
      return actressValide;
    }
  }
  return [];
}

async function getActresses(ids: number[]) {
  const arrayDiPromise = ids.map((id) => getActress(id));
  const risultati = await Promise.all(arrayDiPromise);
  return risultati;
}

getActresses([1, 2, 3]).then((risultati) => {
  console.log("Risultati:", risultati);
});
