import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { HtmlHTMLAttributes } from "react";

const EventPosters: React.FC<HtmlHTMLAttributes<HTMLDivElement> & { posters: ImageInfo[] }> = ({ className, posters }) => {
    
    return (
        <div className={ cn(`event-posters ${className}`) }>
            {
                posters.map((poster: ImageInfo, index) => <Poster poster={ poster } key={ index }/>)
            }
        </div>
    )
}

const Poster: React.FC<HtmlHTMLAttributes<HTMLDivElement> & { poster: ImageInfo}> = ({ poster }) => {
    return (
        <div className="event-poster">
            <div className="poster-overlay" style={ { backgroundImage: `url(${poster.url})` }}>
                <Image src={ poster.url} alt={ poster.public_id } className="event-poster-img invisible" width={100} height={100} />
            </div>
        </div>
    );
}


export {
    EventPosters,
    Poster
}