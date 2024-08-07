import { cn } from "@/lib/utils";
import React, { HTMLAttributes, useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { getCookieUser, useGetUsers } from "@/hooks/useGetUsers";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface UserSearchFormProps extends HTMLAttributes<HTMLDivElement> {

}
const actor = getCookieUser();

export default function UserSearchForm({ children, className, ...props }: UserSearchFormProps) {
    const [searchResults, setSearchResults] = useState<UserInfo[] | []>([]);
    const [usersLoading, prefetchedUsers, usersPrefetchError] = useGetUsers(actor);
    const route = usePathname();
    const router = useRouter();
    let searchParams = useSearchParams();
    const [keyword, setKeyword] = useState<string>(searchParams.get('keyword') ?? '');

    const handleSearchInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const target = ev.target as HTMLInputElement;
        const search = target.value;
        const url = route + '?keyword=' + search?.replace(' ', '+');
        history.replaceState(null, '', url);

        if (!search.length) {
            setKeyword('');
            return;
        }
        setKeyword(search);
    }

    useEffect(() => {
        if (!keyword.length || !prefetchedUsers.length) {
            setSearchResults([]);
            return;
        }

        console.log(prefetchedUsers);
        const results = prefetchedUsers.filter(user => {
            const props = [
                user.firstname,
                user.lastname,
                user.email,
                user.phone,
            ];
            // const propMatches = props.includes(search);
            const propsString = props.join(' ');
            const lowerPropsString = propsString.toLowerCase();
            const lowerSearch = keyword?.toLowerCase().replaceAll('/', '').replaceAll("\\", '');

            console.log(lowerPropsString);
            return lowerPropsString.search(lowerSearch) >= 0;
        });

        const uniqueResults = results.removeDuplicates('id');
        console.log(uniqueResults);

        setSearchResults(uniqueResults);
        // resultConsumer && resultConsumer(uniqueResults);
    }, [keyword, prefetchedUsers]);

    // useEffect(() => {
    //     setKeyword();
    // }, []);


    return (
        <Card>
            <CardContent className="p-0">
                <div className={cn("user-search-form", className)} {...props}>
                    <div className="form-container">
                        <form method="get">
                            <div className="form-group">
                                <div className="input-group">
                                    <Input type="search"
                                        name="keyword"
                                        placeholder="Search..."
                                        className="border-0 shadow-none h-14 text-lg focus-visible:ring-0 search-box:icon-left"
                                        value={keyword || ''}
                                        onChange={handleSearchInput} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {
                    keyword && (
                        <div className="border-t p-3">
                            {
                                searchResults.length > 0 ? (
                                    <RenderSearchResult results={searchResults} />
                                ) : (
                                    <div>No result found</div>
                                )
                            }
                        </div>
                    )
                }
            </CardContent>
        </Card>
    )
}

function RenderSearchResult({ results }: { results: UserInfo[] }) {

    return (
        <ul>
            {
                results.map((user, index) => (
                    <li key={index} className="border-b">
                        <Link href={`/${actor.isOwner ? 'users' : 'team'}/${user.id}`} className="text-primary py-2">{user.firstname + ' ' + user.lastname}</Link>
                    </li>
                ))
            }
        </ul>
    )
}