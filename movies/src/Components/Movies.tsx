import React, { useEffect, useState } from 'react'
import { moveEmitHelpers } from 'typescript';

export const LatestMovie = () => {
    const [data, setData] = useState<any>({});
    const [tmp, settmp] = useState<any>()
    const [suggestions, setSuggestions] = useState(false)
    const [suggestionsResult, setSuggestionsResult] = useState<any>()
    const api_key = "ad2c28e0345278f3c8b002efddadf28f"
    const request = "https://api.themoviedb.org/3/movie/popular?api_key=" + api_key + "&language=en-US&page=1"
    const sort = () => {
        const t: {} = data.sort((a: any, b: any) => {
            let one = new Date(a.release_date) as any
            let two = new Date(b.release_date) as any
            return two - one
        })
        settmp(t)
    }
    const singlePage = (title: string) => {
        const tempo = data.filter((movie: any) => movie.title === title)
        setSuggestions(true)
        setData(tempo)
    }

    useEffect(() => {
        const dataFetch = async () => {

            await fetch(request)
                .then(res => res.json()).then(result => setData(result.results))
        };
        dataFetch();
    }, [])
    useEffect(() => {
        if (tmp) {
            setData(tmp)
        }
    }, [tmp])
    useEffect(() => {
        if (suggestions) {
            let movie_id = data[0].id
            fetch(`https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=${api_key}&language=en-US&page=1`)
                .then(res => res.json().then((e: any) => setSuggestionsResult(e.results)))

        }
    }, [suggestions])
    return (
        <div>
            <div>
                {
                    !suggestions &&
                    <button onClick={() => sort()}>sort by date</button>
                }

                <div>

                </div>movie : (click on one to show details and suggestions) {Object.values(data).map((movie: any) => (
                    <div style={{ fontWeight: "bold" }} onClick={() => singlePage(movie.title)} key={movie.title}>{movie.title}
                        Popularity {movie.popularity} release Date : {movie.release_date}</div>
                ))}</div>
            {
                suggestions &&
                <div style={{ fontSize: "2em", fontWeight: "bolder" }}> Suggestions :</div>
            }

            {

                suggestions && suggestionsResult &&

                Object.values(suggestionsResult).map((movie: any) => (
                    <div key={movie.title}>
                        {movie.title} , {movie.popularity} , {movie.release_date}
                    </div>
                ))
            }
        </div >

    )
}
