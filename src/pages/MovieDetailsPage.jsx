import { Button, Paper, Stack, Typography } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

export default function MovieDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Paper elevation={0} sx={{ p: 4, border: 1, borderColor: 'divider', borderRadius: 3, mt: 4 }}>
      <Stack spacing={2}>
        <Button
          variant="text"
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate(-1)}
          sx={{ alignSelf: 'flex-start', px: 0 }}
        >
          Back
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Movie details for ID: {id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Movie information, cast, genres, and trailer details will be added in the next phases.
        </Typography>
      </Stack>
    </Paper>
  );
}
