import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  role : string = "";
  faqClientContent : any = [];
  faqPartenaireContent : any = [];

  constructor(private navCtrl : NavController, public storage: Storage) {
    this.faqClientContent = [
      {title : "Comment devenir membre ?", text: "Pour devenir membre de Drinks up, il vous suffit de télécharger l’application et de vous inscrire. Vous pourrez ensuite avoir accès à l’application. Il vous faudra cependant vous abonner pour une durée de votre choix afin de pouvoir bénéficier des offres quotidiennes."},
      {title : "Comment obtenir mon verre offert ?", text: "Pour bénéficier de l’offre auprès d’un de nos partenaires il vous suffira de vous rendre sur place de montrer le QR-code de l’offre au barman et de lui indiquer la boisson de votre choix. Très important il vous faut acheter un verre selon les détails de l’offre afin de bénéficier de celle-ci."},
      {title : "Comment devenir membre ?", text: "Pour devenir membre de Drinks up, il vous suffit de télécharger l’application et de vous inscrire. Vous pourrez ensuite avoir accès à l’application. Il vous faudra cependant vous abonner pour une durée de votre choix afin de pouvoir bénéficier des offres quotidiennes."},
      {title : "Comment obtenir mon verre offert ?", text: "Pour bénéficier de l’offre auprès d’un de nos partenaires il vous suffira de vous rendre sur place de montrer le QR-code de l’offre au barman et de lui indiquer la boisson de votre choix. Très important il vous faut acheter un verre selon les détails de l’offre afin de bénéficier de celle-ci."},
      {title : "Quel type de boisson puis-je avoir avec Drinks up ?", text: "Les boissons offertes par nos partenaires sont spécialement préparées par leurs soins. Vous pourrez bénéficier de plusieurs types de boissons comme des bières, du vin ou encore diverses boissons non-alcoolisées. A noter que les bars pourront vous offrir des boissons fermentées seulement entre 17h et 20h et ce pendant 2h maximum. Vous pouvez voir le détail des offres de chacun de nos partenaires sous l’onglet « Offre »."},
      {title : "Comment les bars sont sélectionnés ?", text: "Nous avons fait une sélection d’excellent bars, pub, café, etc... Une offre diversifiée d’établissement vous est proposée afin de correspondre aux gouts de chacun. Nous nous sommes assurés que vous bénéficierez d’un service et de boissons de grande qualité."},
      {title : "Puis-je profiter de plusieurs verres offerts par jour ?", text: "L’offre quotidienne de nos partenaires est unique. Il vous sera donc possible de profiter d’un seul verre offert par jour et par établissement."},
      {title : "À qui est destiné le verre offert ?", text: "Le verre qui vous est offert par notre partenaire peut aussi bien être pour vous que pour la personne qui vous accompagne. Si plusieurs de vos amis ont l’application cela peut vous permettre de faire de grosses économies sur une soirée."},
      {title : "Combien de temps après m’être abonné puis-je commander ma première boisson ?", text: "Une fois le paiement validé et l’abonnement activé vous pourrez tout de suite profiter des offres de nos partenaires."},
    ];

    this.faqPartenaireContent = [
      {title : "Comment passer de membre à partenaire ?", text: "L’établissement doit télécharger l’application puis s’inscrire de manière régulière comme un client. Un administrateur fera ensuite passer le compte de « Client » à « Partenaire ». L’établissement aura ensuite la possibilité de modifier ses informations, d’ajouter ses offres, de les scanner et de voir les statistiques."},
      {title : "Comment publier une offre ?", text: "Pour publier une offre le partenaire doit cliquer sur l’onglet « Offres ». Ensuite, il suffit de définir la date de début et de fin et d’ajouter dans la description les détails de l’offre. Cliquer pour finir sur « Ajouter l’offre », vérifier les informations, glisser l’offre sur la droite et confirmer pour l’activer."},
      {title : "Comment modifier les informations de mon établissement ?", text: "Pour modifier les informations de son établissement il suffit de cliquer sur l’onglet « Bar ». Vous pourrez y définir le nom de votre commerce, l’adresse, vos horaires et y ajouter une courte description. Vous pourrez aussi ajoutez quelques photos afin que les clients puissent se faire une idée."},
      {title : "Comment voir ses statistiques ?", text: "Afin de consulter les statistiques de votre commerce, il vous faut cliquer sur l’onglet « Stats », puis sur « <i class='fas fa-sort-down'></i> » pour voir le détail du mois qui vous intéresse. Il est aussi possible de changer l’année."},
    ];
  }

  ngOnInit() {
  }

  ionViewWillEnter() : void{
    this.storage.get('SessionRoleKey').then((roleval) => {
      this.role = roleval;
      console.log(this.role)
    });  
  }

  expandTitleC(index){
    var sign = document.getElementById("signc_"+index).innerText;
    if(sign === "+"){
      for(let i = 0; i<this.faqClientContent.length; i++){
        document.getElementById("signc_"+i).innerText = "+";      
        document.getElementById("faqc_wrapper_"+i).style.height = "50px";
      } 
      document.getElementById("signc_"+index).innerText = "-";
      document.getElementById("faqc_wrapper_"+index).style.height = "auto";
      
    }else{
      document.getElementById("signc_"+index).innerText = "+";
      document.getElementById("faqc_wrapper_"+index).style.height = "50px";
    }
  }

  expandTitleP(index){
    var sign = document.getElementById("signp_"+index).innerText;
    if(sign === "+"){
      for(let i = 0; i<this.faqPartenaireContent.length; i++){
        document.getElementById("signp_"+i).innerText = "+";      
        document.getElementById("faqp_wrapper_"+i).style.height = "50px";
      } 
      document.getElementById("signp_"+index).innerText = "-";
      document.getElementById("faqp_wrapper_"+index).style.height = "auto";
      
    }else{
      document.getElementById("signp_"+index).innerText = "+";
      document.getElementById("faqp_wrapper_"+index).style.height = "50px";
    }
  }

  retour(){
    this.navCtrl.back();
  }

}
