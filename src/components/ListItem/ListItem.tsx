import React from 'react';
import * as sc from './ListItem.sc';
import {FadeInView} from '../../utils/Animations/fade.animation';

interface ListItemProps {
  item: any;
  onPress?: () => void;
}

export const ListItem: React.FunctionComponent<ListItemProps> = ({
  item,
  onPress,
}) => {
  return (
    <FadeInView>
      <sc.ItemCard elevation={2} onPress={onPress}>
        <sc.ItemCardCover key={item.itemID} source={{uri: item.image}} />
        <sc.ItemCardInfoWrapper>
          <sc.ItemCardTitleWrapper>
            <sc.ItemCardTitle>{item.title}</sc.ItemCardTitle>
          </sc.ItemCardTitleWrapper>
          <sc.ItemCardDetailsWrapper>
            <sc.ItemCardDetails>{item.location}</sc.ItemCardDetails>
            <sc.ItemCardDetails>{item.expiration}</sc.ItemCardDetails>
          </sc.ItemCardDetailsWrapper>
        </sc.ItemCardInfoWrapper>
      </sc.ItemCard>
    </FadeInView>
  );
};
