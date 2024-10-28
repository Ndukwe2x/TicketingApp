import React from 'react';

export default function LoadingUserProfile() {
    return (
        <div id="user-profile" className="relative flex flex-col">
            <header id="profile-header" className="flex flex-col header w-full">
                <div className="flex flex-col gap-3 relative px-4 lg:px-8">
                    <div className="account-name flex justify-between items-center mb-4">
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-white">Happy Agi</h1>
                        <div className="hidden md:flex gap-4">
                            <button className="inline-flex items-center justify-center 
                            whitespace-nowrap rounded-md text-sm font-medium transition-colors
                            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                            disabled:pointer-events-none disabled:opacity-50 border border-input
                            bg-background shadow-sm hover:bg-accent hover:text-accent-foreground
                            h-9 px-4 py-2" type="button" aria-haspopup="dialog" aria-expanded="false"
                                aria-controls="radix-:r1b:" data-state="closed">Edit User
                            </button>
                            <button className="inline-flex items-center justify-center whitespace-nowrap 
                            rounded-md text-sm font-medium transition-colors focus-visible:outline-none
                            focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none
                            disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm
                            hover:bg-destructive/90 h-9 px-4 py-2" type="button">Delete</button>
                        </div>
                        <div className="md:hidden">
                            <div role="group" className="flex items-center">
                                <button type="button" id="radix-:r19:" aria-haspopup="menu"
                                    aria-expanded="false" data-state="closed" className="outline-none">
                                    <span className="sr-only">Open menu</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="action-btns hidden md:flex">
                        <button className="inline-flex items-center justify-center whitespace-nowrap 
                        rounded-md text-sm font-medium transition-colors focus-visible:outline-none
                        focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none
                        disabled:opacity-50 bg-primary text-primary-foreground shadow
                        hover:bg-primary/90 h-9 px-4 py-2 gap-2" type="button" aria-haspopup="dialog"
                            aria-expanded="false" aria-controls="radix-:r1e:"
                            data-state="closed">Create Event</button>
                    </div>
                </div>
            </header>
            <main id="profile-body" className="px-4 lg:px-8">
                <aside className="sidebar">
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6 pt-0">
                            <div className="avatar profile-card-avatar" style="width: 100px; height: 100px;">
                                <img alt="Happy Agi" width="100" height="100" decoding="async" data-nimg="1"
                                    src="" style="">
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="flex flex-col items-center">
                                    <h4 className="scroll-m-20 font-semibold tracking-tight responsive-text">Events</h4>
                                    <span className="counter">5</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <h4 className="scroll-m-20 font-semibold tracking-tight responsive-text">Team Members</h4>
                                    <span className="text-red-800 text-sm">N/A</span>
                                </div>
                            </div>
                            <hr className="my-3" />
                            <div>
                                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3">Contact Info</h3>
                                <div className="flex gap-3 flex-col">
                                    <h4 className="scroll-m-20 font-semibold tracking-tight">
                                        <span className="inline-block w-1/3">Email:</span>
                                        <span className="text-sm">emmanuelhappy1983@gmail.com</span>
                                    </h4>
                                    <h4 className="scroll-m-20 font-semibold tracking-tight">
                                        <span className="inline-block w-1/3">Phone:</span>
                                        <span className="text-sm">+234806439882</span>
                                    </h4>
                                    <h4 className="scroll-m-20 font-semibold tracking-tight">
                                        <span className="inline-block w-1/3">User Type:</span><span className="text-sm">owner</span>
                                    </h4>
                                    <h4 className="scroll-m-20 font-semibold tracking-tight">
                                        <span className="inline-block w-1/3">Role:</span>
                                        <span className="text-sm">Super</span>
                                    </h4>
                                    <h4 className="scroll-m-20 font-semibold tracking-tight">Registered on: <span className="text-sm">01 August, 2024 at 19:08 PM</span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
                <main className="major">
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex flex-col p-6">
                            <h3 className="font-semibold leading-none tracking-tight">Happy's Events</h3>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="grid-container ">
                                <div className="rix-ui-grid-layout">
                                    <div className="rix-ui-grid-row grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-3">
                                        <div className="rix-ui-grid-column">
                                            <div className="">
                                                <div className="rounded-xl border bg-card text-card-foreground shadow rix-ui-grid-card">
                                                    <div className="rix-ui-grid-card-header bg-muted flex flex-col justify-end overflow-hidden p-0 relative rounded-t-[10px]">
                                                        <a className="block w-full h-full" href="/events/671a08ff26df719c6836797f">
                                                            <img alt="The Big Grill Party" loading="lazy" width="300" height="120" decoding="async" data-nimg="1" className="rounded-t-[10px] w-full h-full" srcset="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1729761558%2FThe%2520Big%2520Grill%2520Party%2FBig_grill_main_klboze.jpg&amp;w=384&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1729761558%2FThe%2520Big%2520Grill%2520Party%2FBig_grill_main_klboze.jpg&amp;w=640&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1729761558%2FThe%2520Big%2520Grill%2520Party%2FBig_grill_main_klboze.jpg&amp;w=640&amp;q=75" style="color: transparent;" />
                                                        </a>
                                                        <div className="absolute p-2 right-0">
                                                            <div className="brickwall-datetime">
                                                                <div className="brickwall datetime-wrapper">
                                                                    <div className="block1 date-day-month">
                                                                        <div className="grid">
                                                                            <div className="date-day">7</div>
                                                                            <div className="date-month">Dec</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="block2 date-year">
                                                                        <div className="grid">
                                                                            <div className="date-year-thousands">20</div>
                                                                            <div className="date-year-hundreds">24</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="block3 date-time">09:00 PM</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 rix-ui-grid-card-body py-3 px-3 border-t">
                                                        <div className="flex gap-5 justify-between w-full">
                                                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight"><a href="/events/671a08ff26df719c6836797f">The Big Grill Party</a>
                                                            </h3>
                                                            <div id="eve-47H0gaNyIQmh4PDkNJaCxOKDvsI9O9GX">
                                                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" type="button" id="radix-:r1h:" aria-haspopup="menu" aria-expanded="false" data-state="closed"><span className="sr-only">Open menu</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rix-ui-grid-column">
                                            <div className="">
                                                <div className="rounded-xl border bg-card text-card-foreground shadow rix-ui-grid-card">
                                                    <div className="rix-ui-grid-card-header bg-muted flex flex-col justify-end overflow-hidden p-0 relative rounded-t-[10px]"><a className="block w-full h-full" href="/events/66e95d47489403378f5af7d1">
                                                        <img alt="Jazz Night Port Harcourt Concert" loading="lazy" width="300" height="120" decoding="async" data-nimg="1" className="rounded-t-[10px] w-full h-full" srcset="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1726569793%2FJazz%2520night%2520Port%2520Harcourt%2520Concert%2FTestBanner_ntce45.jpg&amp;w=384&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1726569793%2FJazz%2520night%2520Port%2520Harcourt%2520Concert%2FTestBanner_ntce45.jpg&amp;w=640&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1726569793%2FJazz%2520night%2520Port%2520Harcourt%2520Concert%2FTestBanner_ntce45.jpg&amp;w=640&amp;q=75" style="color: transparent;"></a>
                                                        <div className="absolute p-2 right-0">
                                                            <div className="brickwall-datetime"><div className="brickwall datetime-wrapper">
                                                                <div className="block1 date-day-month"><div className="grid"><div className="date-day">19</div>
                                                                    <div className="date-month">Sep</div>
                                                                </div>
                                                                </div>
                                                                <div className="block2 date-year">
                                                                    <div className="grid">
                                                                        <div className="date-year-thousands">20</div>
                                                                        <div className="date-year-hundreds">24</div></div></div><div className="block3 date-time">01:00 PM</div></div></div></div></div><div className="p-6 rix-ui-grid-card-body py-3 px-3 border-t"><div className="flex gap-5 justify-between w-full"><h3 className="scroll-m-20 text-2xl font-semibold tracking-tight"><a href="/events/66e95d47489403378f5af7d1">Jazz Night Port Harcourt Concert</a></h3><div id="eve-O7Q823eIJkwnxWyv750oju7EbzTqupTA"><button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" type="button" id="radix-:r1j:" aria-haspopup="menu" aria-expanded="false" data-state="closed"><span className="sr-only">Open menu</span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="h-4 w-4" font-size="24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></button></div></div></div></div></div></div><div className="rix-ui-grid-column"><div className=""><div className="rounded-xl border bg-card text-card-foreground shadow rix-ui-grid-card"><div className="rix-ui-grid-card-header bg-muted flex flex-col justify-end overflow-hidden p-0 relative rounded-t-[10px]"><a className="block w-full h-full" href="/events/66b114a1e9c6667ec4e30c34"><img alt="LightUp Port Harcourt Musical Festival" loading="lazy" width="300" height="120" decoding="async" data-nimg="1" className="rounded-t-[10px] w-full h-full" srcset="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1722881182%2FLightUp%2520Port%2520Harcourt%2520Musical%2520Festival%2Flightupcarraffle_oaewbp.jpg&amp;w=384&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1722881182%2FLightUp%2520Port%2520Harcourt%2520Musical%2520Festival%2Flightupcarraffle_oaewbp.jpg&amp;w=640&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1722881182%2FLightUp%2520Port%2520Harcourt%2520Musical%2520Festival%2Flightupcarraffle_oaewbp.jpg&amp;w=640&amp;q=75" style="color: transparent;"></a><div className="absolute p-2 right-0"><div className="brickwall-datetime"><div className="brickwall datetime-wrapper"><div className="block1 date-day-month"><div className="grid"><div className="date-day">15</div><div className="date-month">Sep</div></div></div><div className="block2 date-year"><div className="grid"><div className="date-year-thousands">20</div><div className="date-year-hundreds">24</div></div></div><div className="block3 date-time">02:00 PM</div></div></div></div></div><div className="p-6 rix-ui-grid-card-body py-3 px-3 border-t"><div className="flex gap-5 justify-between w-full"><h3 className="scroll-m-20 text-2xl font-semibold tracking-tight"><a href="/events/66b114a1e9c6667ec4e30c34">LightUp Port Harcourt Musical Festival</a></h3><div id="eve-iQJmZ6MlWPEhODiaHMxuJcgP5NLME8uR"><button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" type="button" id="radix-:r1l:" aria-haspopup="menu" aria-expanded="false" data-state="closed"><span className="sr-only">Open menu</span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="h-4 w-4" font-size="24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></button></div></div></div></div></div></div><div className="rix-ui-grid-column"><div className=""><div className="rounded-xl border bg-card text-card-foreground shadow rix-ui-grid-card"><div className="rix-ui-grid-card-header bg-muted flex flex-col justify-end overflow-hidden p-0 relative rounded-t-[10px]"><a className="block w-full h-full" href="/events/66ac2f0de28915794ba1c779"><img alt="LightUp Port Harcourt Musical Festival" loading="lazy" width="300" height="120" decoding="async" data-nimg="1" className="rounded-t-[10px] w-full h-full" srcset="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1722560266%2FLightUp%2520Port%2520Harcourt%2520Musical%2520Festival%2Flightbannerevent_n5nefu.jpg&amp;w=384&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1722560266%2FLightUp%2520Port%2520Harcourt%2520Musical%2520Festival%2Flightbannerevent_n5nefu.jpg&amp;w=640&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1722560266%2FLightUp%2520Port%2520Harcourt%2520Musical%2520Festival%2Flightbannerevent_n5nefu.jpg&amp;w=640&amp;q=75" style="color: transparent;"></a><div className="absolute p-2 right-0"><div className="brickwall-datetime"><div className="brickwall datetime-wrapper"><div className="block1 date-day-month"><div className="grid"><div className="date-day">15</div><div className="date-month">Sep</div></div></div><div className="block2 date-year"><div className="grid"><div className="date-year-thousands">20</div><div className="date-year-hundreds">24</div></div></div><div className="block3 date-time">02:00 PM</div></div></div></div></div><div className="p-6 rix-ui-grid-card-body py-3 px-3 border-t"><div className="flex gap-5 justify-between w-full"><h3 className="scroll-m-20 text-2xl font-semibold tracking-tight"><a href="/events/66ac2f0de28915794ba1c779">LightUp Port Harcourt Musical Festival</a></h3><div id="eve-Dt089LEjOcVp6p1GGX0RXE6WRlNHB1nE"><button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" type="button" id="radix-:r1n:" aria-haspopup="menu" aria-expanded="false" data-state="closed"><span className="sr-only">Open menu</span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="h-4 w-4" font-size="24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></button></div></div></div></div></div></div><div className="rix-ui-grid-column"><div className=""><div className="rounded-xl border bg-card text-card-foreground shadow rix-ui-grid-card"><div className="rix-ui-grid-card-header bg-muted flex flex-col justify-end overflow-hidden p-0 relative rounded-t-[10px]"><a className="block w-full h-full" href="/events/66ac27dde28915794ba1c602"><img alt="LightUp Port Harcourt Musical Festival" loading="lazy" width="300" height="120" decoding="async" data-nimg="1" className="rounded-t-[10px] w-full h-full" srcset="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1725234347%2FLightUp%2520Port%2520Harcourt%2520Musical%2520Festival%2Flightupbannermain_syw0aj.jpg&amp;w=384&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1725234347%2FLightUp%2520Port%2520Harcourt%2520Musical%2520Festival%2Flightupbannermain_syw0aj.jpg&amp;w=640&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdtuznvywy%2Fimage%2Fupload%2Fv1725234347%2FLightUp%2520Port%2520Harcourt%2520Musical%2520Festival%2Flightupbannermain_syw0aj.jpg&amp;w=640&amp;q=75" style="color: transparent;"></a><div className="absolute p-2 right-0"><div className="brickwall-datetime"><div className="brickwall datetime-wrapper"><div className="block1 date-day-month"><div className="grid"><div className="date-day">15</div><div className="date-month">Sep</div></div></div><div className="block2 date-year"><div className="grid"><div className="date-year-thousands">20</div><div className="date-year-hundreds">24</div></div></div><div className="block3 date-time">02:00 PM</div></div></div></div></div><div className="p-6 rix-ui-grid-card-body py-3 px-3 border-t"><div className="flex gap-5 justify-between w-full"><h3 className="scroll-m-20 text-2xl font-semibold tracking-tight"><a href="/events/66ac27dde28915794ba1c602">LightUp Port Harcourt Musical Festival</a></h3><div id="eve-QyYt1dGCoK3HkDTopkK5E6cvUQAmBFn6"><button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" type="button" id="radix-:r1p:" aria-haspopup="menu" aria-expanded="false" data-state="closed"><span className="sr-only">Open menu</span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="h-4 w-4" font-size="24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></button></div></div></div></div></div></div></div></div><div className="flex gap-4 items-center justify-end mt-6"><button type="button" className="border disabled:opacity-50 disabled:pointer-events-none flex focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 hover:bg-accent items-center justify-between px-2 py-1 rounded-md shadow text-foreground text-sm transition-colors whitespace-nowrap" disabled=""><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path></svg>Previous</button><span>1 of 1</span><button type="button" className="border disabled:opacity-50 disabled:pointer-events-none flex focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 hover:bg-accent items-center justify-between px-2 py-1 rounded-md shadow text-foreground text-sm transition-colors whitespace-nowrap" disabled="">Next <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></button></div></div></div></div></main></main></div>
    );
}
