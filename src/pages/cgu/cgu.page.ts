import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.page.html',
  styleUrls: ['./cgu.page.scss'],
})
export class CguPage implements OnInit {
  cguContent: any = [];
  readmoreDisplay : string = "none";
  readMoreClicked : boolean = false;
  artTitleClicked : boolean = false;

  constructor(private navCtrl: NavController) {
    this.cguContent = [
      {ArticleTitle: "Article 1: Définition", 
        aticleContent:[
            {subtitle: "1.1 Abonnement", subcontent: "L’Abonnement au Service souscrit en ligne via l’Application par l'Abonné. L'Abonnement est nominatif."},
            {subtitle: "1.2 Application", subcontent: "Ce terme désigne l’application mobile disponible sur Android et iPhone proposée au Membre Drinks up pour découvrir les Etablissements et profiter d’avantages exclusifs."},
            {subtitle: "1.3 Etablissement", subcontent: "L’établissement partenaire du Service qui propose aux Membres Drinks up de bénéficier d’avantages exclusifs."},
            {subtitle: "1.4 Inscrit", subcontent: "Personne physique, dotée de la pleine capacité juridique, qui s’est inscrite sur notre application en créant un compte qui lui est propre. Pour accéder au Service, elle doit alors devenir Membre en souscrivant un Abonnement."},
            {subtitle: "1.5 Membre", subcontent: "Personne physique, dotée de la pleine capacité juridique, souscrivant un Abonnement Drinks up. Les partenaires de Drinks up se réservent le droit de procéder à des vérifications concernant l'identité et l'âge du Membre."},
            {subtitle: "1.6 Service", subcontent: "Service fourni par la Société via l’application, permettant au Membre ayant souscrit un Abonnement d'accéder à une liste d’Etablissements dans lesquels il peut bénéficier d’avantages exclusifs."},
            {subtitle: "1.7 Site", subcontent: "Il désigne le site Internet accessible à l'adresse http://www.drinksup.ch, édité par la Société."},
            {subtitle: "1.8 Société", subcontent: "Ce terme désigne la société Drinks up (SNC), inscrite au registre du commerce suisse."}
        ]
      },
      {ArticleTitle: "Article 2: Inscription", ArticleText: "En vous créant un compte sur l’application, vous reconnaissez: fournir des informations réelles, avérées, complètes et d’actualité lors de la création du compte, créer un mot de passe sécurisé, maintenir vos informations à jour, utiliser le Service à des fins personnelles et non commerciales, de ne pas avoir plus d’un compte (sans quoi une sanction peut être appliquée), de ne pas vendre ou transférer un compte d’une personne à une autre, ou essayer d’accéder au Service autrement que par le Site ou l’Application proposés publiquement. Vous êtes responsables de toute activité réalisée sur votre compte. En cas d’oubli de votre mot de passe, vous pourrez demander la réinitialisation de celui-ci. Si votre adresse mail est bien valide, un e-mail vous sera envoyé avec un code d’accès à l’Application, et vous pourrez alors réinitialiser votre mot de passe. Vous reconnaissez être entièrement responsable de toute atteinte aux Conditions Générales d’Utilisation énumérées ici, et vous assumez entièrement les éventuelles conséquences du non-respect des Conditions Générales d’Utilisation. Vous reconnaissez également que, si vous êtes au courant de toute utilisation non autorisée du Service, il est de votre devoir de contacter les équipes de Drinks up immédiatement."},
      {ArticleTitle: "Article 3: Procedure de paiement", ArticleText: "Actuellement, Drinks up propose à ses Membres plusieurs offres d’abonnement mensuel, trimestriel, semestriel et annuel. Nous nous réservons le droit de modifier à tout moment les prix. Tout changement de prix prendra effet dès le prochain paiement concerné, et sera explicitement communiqué via le Site ou l’Application ou tout autre moyen de communication à disposition. Vos données bancaires sont utilisées et stockées de façon sécurisée par notre partenaire Stripe. Drinks up ne conserve aucune donnée concernant vos informations bancaires. Le paiement est donc assujetti aux Conditions Générales de Stripe en plus de nos Conditions Générales. Supprimer l’Application ne résilie pas votre Abonnement, veillez à suivre les conditions d’Annulation de l’Abonnement correctement. La date de début de l'Abonnement correspond à la date de souscription et paiement de cet abonnement."},
      {ArticleTitle: "Article 4: Définition du service", ArticleText: "Drinks up propose uniquement un service de marketing à ses établissements partenaires en les référençant de manière qualitative sur le Site et l’Application, afin que les Inscrits et les Membres puissent les découvrir et profiter de ces lieux et des produits qui y sont proposés. Drinks up est un club privé, et le paiement pour l’Abonnement est un moyen de reconnaître un Membre (à différencier d’un simple Inscrit) et de lui donner accès aux différentes offres. A aucun moment, Drinks up ne vend de l’alcool ou des boissons alcoolisées. L’Abonnement propose, sans en être limité, l’accès à des avantages exclusifs dans des lieux partenaires."},
      {ArticleTitle: "Article 5: Absence de droit de rétraction", 
        aticleContent:[
          {subtitle:"5.1 Absence de droit de rétractation", subcontent:"Le Membre reconnaît et accepte expressément que la fourniture du Service commence immédiatement après la validation de son abonnement soit avant la fin du délai de quatorze jours prévu par le Code de la Consommation et reconnaît et accepte en conséquence de ne pas bénéficier du droit de rétractation lié à la vente en ligne ou à distance. En conséquence, aucune demande de rétractation, d'annulation ou de remboursement ne sera recevable pour la période souscrite."},
          {subtitle:"5.2 Durée", subcontent:"Drinks up propose un Abonnement d’une durée d’un mois, trois mois, six mois et un an. Il se peut également que des offres d’essai ou de découverte du Service d’une durée variable soient proposées sur le Site et l’Application, de manière temporaire ou non. Sauf indication contraire, ces offres d’essai ou de découverte seront soumises aux présentes Conditions Générales d’Utilisation et de vente et seront limitées à une seule inscription (même adresse IP (Internet Protocol) et/ou même adresse de courrier électronique) quelque soit l’offre d’essai ou de découverte."},
          {subtitle:"5.3 Reconduction", subcontent:"Sauf résiliation par le Membre dans les conditions de l’article 5.4, l’Abonnement au Service est reconduit tacitement pour la même durée que celle souscrite. En cas de reconduction tacite, le tarif alors en vigueur pour l’Abonnement concerné sera pleinement applicable au Membre. Sauf indication contraire sur le Site et sauf résiliation par l’Abonné dans les conditions de l’article 5.4."},
          {subtitle:"5.4 Pour résilier son abonnement", subcontent:"L’Abonné doit notifier son désir de résilier son Abonnement à partir de son Compte sur l’Application en cliquant sur la rubrique dans son onglet « profil ». La prise en compte de la résiliation sera effective au terme de la période d’Abonnement en cours sous réserve que sa notification ait été envoyée au moins une semaine avant le terme de son abonnement, et jusqu’à la date et heure de fin telle qu’indiquée sur le compte du Membre pour une offre d’essai ou de découverte, sauf indication contraire sur le Site."},
        ]
      },
      {ArticleTitle: "Article 6: Responsabilité ", ArticleText: "Drinks up ne sera pas responsable à l’égard de l’Inscrit ou du Membre sauf en cas de faute grave ou dol commis personnellement par Drinks up, que ce soit sur la base du contrat, d’un chef de responsabilité civile, ou d’une garantie. La responsabilité pour tout acte d’auxiliaire est exclue.", 
        ArticleSubtext1: "La responsabilité est notamment exclue pour :",
        aticleList:[
          {list:"Défaut de fonctionnement du terminal de l’Inscrit et du Membre ou de problème de compatibilité entre le terminal et l’Application"},
          {list:"Suppression, incapacité à stocker et/ou transmettre des contenus via l’Application"},
          {list:"Actions illégales ou passibles de sanctions pénales faites par ses Membres"},
          {list:"Refus du bar partenaire, sur présentation du code QR, de fournir une boisson offerte à prix égal ou inférieur à la boisson achetée"},
          {list:"Pannes, interruptions ou mauvais fonctionnement des services du fournisseur d’accès à Internet, ainsi que toute cause extérieure qui pourrait interrompre ou endommager l’accès à l’Application"},
        ],
        ArticleSubtext2: "Les Inscrits et les Membres sont informés des éventuels virus pouvant circuler sur Internet et qui pourraient éventuellement contaminer ses terminaux.",
        ArticleSubtext3: "Drinks up se réserve le droit de conserver les traces de tout contenu ou action afin de les mettre à disposition des autorités compétentes en cas de litige.",
        ArticleSubtext4: "Il est également rappelé que Drinks up ne dispose pas des moyens techniques et humains nécessaires pour effectuer une quelconque modération des contenus ou un contrôle d’identité de ses Membres. Toutefois, en cas de signalement, Drinks up s’engage à vérifier le profil de ses Membres."
      },
      {ArticleTitle: "Article 7: Vie Privée", ArticleText: "Afin de respecter au mieux la vie privée de ses Inscrits et Membres, Drinks up respecte la législation en vigueur en matière de protection de la vie privée.",
        aticleContent:[
          {subtitle:"7.1 Données personnelles collectées par Drinks up", subcontent: "Lors de son inscription, l’Inscrit est invité à fournir des données personnelles le concernant, toutes ces données seront entièrement privées et Drinks up s’engage à ne pas revendre ces données. Il est rappelé que toute donnée bancaire est sécurisée et stockée sur Stripe, aucune donnée ne transite sur les serveurs de Drinks up."},
          {subtitle:"7.2 Géolocalisation", subcontent: "Afin d’avoir une utilisation optimale de l’Application, l’Inscrit est invité à activer sa géolocalisation et à donner accès à celle-ci. Ces données lui permettent de découvrir de façon plus ou moins précise les Etablissements les plus proches de lui. Cette géolocalisation n’est pas conservée dans l’Application et ne peut être utilisée ultérieurement par Drinks up."},
          {subtitle:"7.3 Notifications push et alerte e-mail", subcontent: "L’Inscrit et le Membre pourront recevoir des Notifications Push et/ou des alertes e-mail pour plusieurs raisons différentes."},
        ]
      },
      {ArticleTitle: "Article 8: Club Privé", ArticleText: "Drinks up est un club privé et dont le fait d’être membre est un privilège et non une garantie. Drinks up se réserve le droit de mettre fin à l’Abonnement Drinks up à tout moment, sans aucune explication. Votre Abonnement Drinks up ne peut vous garantir l’entrée dans les Etablissements partenaires. Votre comportement et votre attitude dans les Etablissements doivent respecter les lois en vigueur. Les Etablissements peuvent vous refuser l’entrée dans les lieux, sans explicite raison, s’ils considèrent que vous ne respectez pas les codes et attitudes du lieu ou que votre comportement n’est pas acceptable. A tout moment, Drinks up peut décider de résilier votre Abonnement, si vous ne respectez pas les règles de bonne conduite de la communauté. En utilisant le Service, vous reconnaissez : respecter les lois, ne pas avoir plus d’un compte par personne, ne pas utiliser le Service à des fins illégales, ne pas copier le contenu ou design pour des publications en ligne ou hors ligne, ne pas empêcher ou interférer l’utilisation de l’Application ou du Site par un Membre, ne pas diffuser des virus ou d’autres dossiers dangereux sur l’Application ou le Site."},
      {ArticleTitle: "Article 9: Propriété Intellectuelle", ArticleText: "Tout le contenu du Site, de l’Application, ainsi que des supports de communication (Textes, Logos, Design, Codes sources, Vidéos, Sons...) est propriété de la société Drinks up et est protégé par les lois suisses relatives à la propriété intellectuelle. Toute représentation et/ou reproduction et/ou exploitation de tout ou partie du contenu du site, de l’Application ou des supports de communication sous quelque forme que ce soit ou support que ce soit est formellement interdit et constitue un délit au regard de la loi suisse en plus d’être passible de poursuites judiciaires. Le nom Drinks up et le logo sont déposés : toute diffusion, exploitation ou reproduction sans autorisation écrite préalable est strictement interdite et engagera la responsabilité du contrevenant devant les autorités compétentes. Les droits d’utilisation concédés par Drinks up sont réservés à un usage personnel et privé."},
      {ArticleTitle: "Article 10: Modification des services et des conditions d'utilisation", ArticleText: "Les fonctionnalités et/ou services afférents de l’Application sont évolutifs et Drinks up se réserve le droit de modifier et/ou supprimer à tout moment, sans préavis et à son entière discrétion, son service et/ou certaines fonctionnalités et/ou les présentes CGU. De même, de nouveaux services peuvent être lancés à tout moment et sans préavis, qu’ils soient payants ou gratuits."},
      {ArticleTitle: "Article 11: Divisibilité", ArticleText: "Si une des dispositions des présentes CGU s’avère nulle, les autres dispositions des présentes CGU resteront valables et continueront à lier Drinks Up et l’Inscrit ou le Membre, respectivement."},
      {ArticleTitle: "Article 12: Survivance", ArticleText: "Toute disposition des présentes CGU qui, par nature, doit continuer à déployer ses effets après l’expiration ou la résiliation du Contrat, restera en vigueur après cette expiration ou résiliation."},
      {ArticleTitle: "Article 13: Droit applicable et Juridiction Compétente", ArticleText: "Tout litige directement ou indirectement en relation avec les présentes CGU, quelle qu’en soit la cause, sera soumis au droit suisse et porté devant les tribunaux du canton de Genève, sous réserve d’un éventuel recours au Tribunal Fédéral. La langue d’interprétation des présentes CGU est le français."},
      {ArticleTitle: "Article 14: Publicité et Promotions", ArticleText: "Drinks up peut diffuser des publicités ou promotions de parties tierces sur le Site ou l’Application. La participation à des événements, promotions ou autres transactions, autres que ceux mis en place par Drinks up ne concerne pas Drinks up et n’entraîne pas la responsabilité de l’entreprise. Drinks up ne peut être tenu comme responsable de toute perte ou dommages survenus lors de tels événements ou transactions."},
    ];

  }

  ngOnInit() {
  }

  expandTitle(index){
    var sign = document.getElementById("sign_"+index).innerText;
    var sublength = 0;
    if(sign === "+"){
      for(let i = 0; i<this.cguContent.length; i++){
        document.getElementById("sign_"+i).innerText = "+";      
        document.getElementById("article_wrapper_"+i).style.height = "40px";
      } 
      document.getElementById("sign_"+index).innerText = "-";
      document.getElementById("article_wrapper_"+index).style.height = "auto";
      
    }else{
      document.getElementById("sign_"+index).innerText = "+";
      document.getElementById("article_wrapper_"+index).style.height = "40px";
    }

    if(index === "0"){
      sublength = 8;
    }else if(index === "4"){
      sublength = 4;
    }else if(index === "6"){
      sublength = 3;
    }
    
    for(let i = 0; i<this.cguContent.length; i++){
      for(let ii = 0; ii<sublength; ii++){
        document.getElementById("subcontent_wrapper_"+i+"_"+ii).style.height = "40px";
        document.getElementById("sub_sign_"+i+"_"+ii).innerText = "+";      
      } 
    }
  }

  expandSub(mainIndex,index, length){
    var sign = document.getElementById("sub_sign_"+mainIndex+"_"+index).innerText;
    if(sign === "+"){
      for(let i = 0; i<length; i++){
        document.getElementById("sub_sign_"+mainIndex+"_"+i).innerText = "+";      
      document.getElementById("subcontent_wrapper_"+mainIndex+"_"+i).style.height = "40px";
    } 
      document.getElementById("sub_sign_"+mainIndex+"_"+index).innerText = "-";
      document.getElementById("subcontent_wrapper_"+mainIndex+"_"+index).style.height = "auto";
      
    }else{
      document.getElementById("sub_sign_"+mainIndex+"_"+index).innerText = "+";
      document.getElementById("subcontent_wrapper_"+mainIndex+"_"+index).style.height = "40px";
    }
  }

  readMore(){
    if(!this.readMoreClicked){
      this.readMoreClicked = true;
      this.readmoreDisplay = "block";
      document.getElementById("readMore").innerHTML = "En lire moins&nbsp;<ion-icon name='arrow-dropup'></ion-icon";
    }else{
      this.readMoreClicked = false;
      this.readmoreDisplay = "none";
      document.getElementById("readMore").innerHTML = "En lire plus&nbsp;<ion-icon name='arrow-dropdown'></ion-icon";
    }
    
  }

  retour(){
    this.navCtrl.back();
  }

  //>

}
