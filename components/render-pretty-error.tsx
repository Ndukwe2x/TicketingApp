import InternalErrorPage from "@/app/internal-error";
import ServiceUnavailable from "@/app/service-unavailable";
import { isAxiosError } from "axios";
import NotFoundPage from "@/app/[...not-found]/page";
import Error from "@/app/(main)/error";

export default function RenderPrettyError({ error }: { error: unknown }) {
    if (isAxiosError(error)) {
        const status = error.response ? error.response.status : null;

        switch (status) {
            case 400:
                return <Error error={{ ...error, digest: 'Bad Request' }} reset={() => { }} />
            case 401:
                return <Error error={{ ...error, digest: 'Unauthorized' }} reset={() => { }} />
            case 403:
                return <Error error={{ ...error, digest: 'Forbidden' }} reset={() => { }} />
            case 404:
                return <NotFoundPage />
            case 500:
                return <InternalErrorPage />
            case 503:
                return <ServiceUnavailable />
            default:
                return <Error error={{ ...error, digest: 'An unexpected error occurred' }} reset={() => { }} />
        }
    } else {
        return <InternalErrorPage />
    }
}