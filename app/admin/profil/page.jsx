import { getFullProfil } from '../../../services/profilService';
import ProfilClientContent from './ProfilClientContent';

export default async function AdminProfilPage() {
  const data = await getFullProfil();

  return (
    <ProfilClientContent 
      initialProfil={data.profil}
      initialGeo={data.geografis}
      initialPerangkat={data.perangkat}
    />
  );
}