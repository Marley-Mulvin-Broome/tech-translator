import { Button, Typography } from "@mui/material";

export interface NewsTagsListProps {
    tags: string[];
}

export default function NewsTagsList({ tags }: NewsTagsListProps) {
    return (
        <div style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'flex-start', alignItems: 'center', marginTop: '10px'}}>
            {tags.map((tag, index) => {
                return (
                    <div key={index} style={{marginRight: '10px', marginBottom: '10px', backgroundColor: '#2196F3', padding: '5px', borderRadius: '5px'}}>
                        <Typography variant="subtitle2" color="white">
                            {tag}
                        </Typography>
                    </div>
                );
            })}
        </div>
    )
}