import { useState } from 'react';
import ChoiceList from '@/components/ChoiceList';
import { Typography, Button } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

interface Choice {
  id: string;
  text: string;
}

interface Question {
  _id: string;
  questionText: string;
  choices: Choice[];
}

interface CardDisplayProps {
  questionData: Question;
  handleChoiceSelect: (selectedChoiceIds: string[], question: Question) => void;
  handleSubmit: (question: { _id: string; questionText: string; choices: { id: string; text: string }[] }) => Promise<void>;
}

const CardDisplay: React.FC<CardDisplayProps> = ({questionData, handleChoiceSelect, handleSubmit}) => {
  
  interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
      setExpanded(!expanded);
  };

  const ExpandMore = styled((props: ExpandMoreProps) => {
      const { expand, ...other } = props;
      return <IconButton {...other} />;
      })(({ theme, expand }) => ({
      transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      }),
  }));

  const [isClicked, setIsClicked] = useState(false);
  const handleClick = async (question: Question) => {
    if (isClicked == true) {
      return;
    }
    try {
      const { _id, questionText, choices } = question;
    await handleSubmit({ _id, questionText, choices });
      setIsClicked(true);
    } catch (error) {
      console.error('Error handling click:', error);
    }
  }
return(
  <Card >
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Example 1"
          subheader="Jan 20, 2024"
        />
        <CardContent>

        
      <div>
        
          <div key={questionData._id}>
            <Typography variant="body2" color="text.secondary">
              {questionData.questionText}
            </Typography>
            
            <ChoiceList
            choices={questionData.choices}
            onChoiceSelect={(selectedChoiceIds) => handleChoiceSelect(selectedChoiceIds, questionData)}
            />

            <Button color="primary" disabled={isClicked} onClick={() => handleClick(questionData)}>
              Submit
            </Button>
          </div>
      </div>

           
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
              aside for 10 minutes.
            </Typography>
            <Typography paragraph>
              Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
              medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
              occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
              large plate and set aside, leaving chicken and chorizo in the pan. Add
              pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
              stirring often until thickened and fragrant, about 10 minutes. Add
              saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
            <Typography paragraph>
              Add rice and stir very gently to distribute. Top with artichokes and
              peppers, and cook without stirring, until most of the liquid is absorbed,
              15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
              mussels, tucking them down into the rice, and cook again without
              stirring, until mussels have opened and rice is just tender, 5 to 7
              minutes more. (Discard any mussels that don&apos;t open.)
            </Typography>
            <Typography>
              Set aside off of the heat to let rest for 10 minutes, and then serve.
            </Typography>
          </CardContent>
        </Collapse>
    </Card>
  )
}

export default CardDisplay