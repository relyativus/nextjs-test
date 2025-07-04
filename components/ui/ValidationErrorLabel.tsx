import { Label } from "./label";

export function ValidationErrorLabel({ errors }: { errors?: string[] }) {
    return (
        <>
        {errors?.map(error => <Label className="mt-2 text-sm text-red-500" key={error}>{error}</Label>) }
        </>
    )
}