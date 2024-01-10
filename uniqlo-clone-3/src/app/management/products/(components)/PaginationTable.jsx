import React from 'react';
import Stack from "@mui/joy/Stack";
import {Pagination} from "@mui/material";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const PaginationTable = ({totalPage}) => {
    const {replace} = useRouter();
    const pathname = usePathname();
    const pageParams = useSearchParams();
    const page = parseInt(pageParams.get("page")) || 1;
    const params = new URLSearchParams(pageParams);
    const handleChange = (event, value) => {
        params.set("page",value)
        replace(`${pathname}?${params}`);
    };

    return (
        <div>
            <Stack spacing={2}>
                <Pagination
                    count={totalPage}
                    variant="outlined"
                    shape="rounded"
                    page={page}
                    onChange={handleChange}
                />
            </Stack>
        </div>
    );
};

export default PaginationTable;
