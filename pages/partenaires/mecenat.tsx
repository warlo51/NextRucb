import { Box, CardContent, Container, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import {Layout} from "../../components/Layout";
export default function Mecenat() {
  return (
    <Layout>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
          <Box className="boxMecenat">
            <CardContent>
              <Typography variant="h5" component="div">
                LE RUCB et le mécénat (Partenaires et futurs partenaires)
              </Typography>
              <p></p>
              <Typography variant="body2" color="text.secondary">          
              Dans une décision récente de la Direction Générale des Finances, notre club s’est vu reconnaître le statut d’Association d’intérêt général d’ordre sportif, et par conséquent éligible au régime du Mécénat.
              C’est une très bonne nouvelle pour le développement sportif du RUC Basket.   
              Concrètement, qu’est ce que cela signifie. 
              Notre club est accompagné par quelques sponsors et nous les remercions encore pour leur fidélité et leur soutien. Cependant, afin de se développer, nous avons besoin de nouveaux partenaires.  
              Grâce au mécénat, vous pouvez y contribuer.  
              À travers le mécénat, vous pouvez nous aider à :
              Développer le club sur le moyen et long terme, à travers la modernisation de notre structure associative, ainsi que de la mise à disposition de divers matériels
              Favoriser une pratique sportive pour tous nos licenciés, jeunes et moins jeunes, quelque soit leurs niveaux
              Développer un encadrement sportif et pédagogique de qualité
              Former nos joueurs depuis le plus jeune âge selon nos valeurs
              Former au sein du club nos futurs entraîneurs et arbitres
              Former nos dirigeants actuels et futurs
              La réduction d&apos;impôt pour mécénat, justifiée d’un reçu fiscal que le Club vous remettra, est égale à 60% des versements effectués par l&apos;entreprise au profit d&apos;œuvres ou d&apos;organismes d’intérêt général, retenus dans la limite de 5 ‰ de son chiffre d&apos;affaires.
              Le chiffre d&apos;affaires à retenir est celui réalisé l&apos;année du don, pour son montant hors taxe. Sachez toutefois que la limite de 5 ‰ est commune à la réduction d&apos;impôt pour mécénat et à la déduction admise en cas d&apos;acquisition d’œuvres originales d&apos;artistes vivants.
              En cas de dépassement de la limite de 5 ‰, les dons excédentaires peuvent être reportés sur les cinq années suivantes (après les versements intervenus ces années-là, le cas échéant), et ouvrir droit à réduction d&apos;impôt dans les mêmes conditions et limites.
              De même, si le montant de la réduction d&apos;impôt dépasse l&apos;impôt dû, le reliquat est imputable sur celui à payer au titre des cinq années suivantes.
              </Typography>
            </CardContent>
          </Box>
          <Box className="boxMecenat">
            <CardContent>
              <Typography variant="h5" component="div">
                LE RUCB et le mécénat (Particuliers - Supporters du RUCB)
              </Typography>
              <p></p>
              <Typography variant="body2" color="text.secondary">          
                Comme beaucoup d&apos;association, le club souffre financièrement des baisses des subventions ainsi que des difficultés rencontrées par nos partenaires. Le plus souvent les subventions et les sponsors ne suffisent pas à faire vivre une association. Il est impératif de diversifier les types de ressources.
                C’est pourquoi nous attirons votre attention sur le fait que vous pouvez faire un don au club et que cela vous ouvre des avantages fiscaux offert par la loi sur le don et le mécénat.
                En effet, les personnes physiques peuvent également soutenir l’activité associative comme celle du Club. Les dons et versements aux associations peuvent bénéficier d’une réduction d’impôts. Les règles sont fixées, principalement, par l’article 200 du code général des impôts.
                Vous pouvez ainsi déduire 66% du montant de votre don dans la limite de 20% de votre revenu imposable grâce au reçu fiscal que vous délivrera le Club.
              </Typography>
            </CardContent>
          </Box>
      </div>
    </Layout>
  );
}
