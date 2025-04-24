import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bar } from 'recharts';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';

export default function LocationManagementApp({ openModal = false, openGraphic = false }) {
  const navigate = useNavigate();
  const [showGraphic, setShowGraphic] = useState(false);
  const [locations, setLocations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [locationToDeleteIndex, setLocationToDeleteIndex] = useState(null);
  const [newLocation, setNewLocation] = useState({
    num_loc: '',
    nom_loc: '',
    design_voiture: '',
    nombre_de_jours: '',
    taux_journalier: ''
  });

  useEffect(() => {
    if (openModal) setShowAddModal(true);
  }, [openModal]);

  useEffect(() => {
    if (openGraphic) setShowGraphic(true);
  }, [openGraphic]);

  useEffect(() => {
    fetch('http://localhost:4000/location/list')
      .then(response => response.json())
      .then(data => setLocations(data));
  }, []);

  const calculateStats = () => {
    if (locations.length === 0) return { total: 0, min: 0, max: 0 };
    const loyers = locations.map(loc => loc.nombre_de_jours * loc.taux_journalier);
    return {
      total: loyers.reduce((sum, val) => sum + val, 0),
      min: Math.min(...loyers),
      max: Math.max(...loyers)
    };
  };

  const stats = calculateStats();

  const chartData = [
    { name: 'Loyer Total', valeur: stats.total },
    { name: 'Loyer Minimal', valeur: stats.min },
    { name: 'Loyer Maximal', valeur: stats.max }
  ];

  const handleAddLocation = () => {
    if (!newLocation.nom_loc || !newLocation.design_voiture ||
      !newLocation.nombre_de_jours || !newLocation.taux_journalier) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const updatedLocation = {
      ...newLocation,
      nombre_de_jours: Number(newLocation.nombre_de_jours),
      taux_journalier: Number(newLocation.taux_journalier)
    };

    if (editIndex !== null) {
      fetch(`http://localhost:4000/location/update/${updatedLocation.num_loc}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLocation)
      })
        .then(response => {
          if (!response.ok) throw new Error('Échec de la mise à jour');
          return response.json();
        })
        .then(data => {
          const updatedLocations = [...locations];
          updatedLocations[editIndex] = data;
          setLocations(updatedLocations);
          setEditIndex(null);
          setShowAddModal(false);
          navigate('/');
        })
        .catch(err => {
          console.error(err);
          alert("Erreur lors de la mise à jour");
        });
    } else {
      fetch('http://localhost:4000/location/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLocation)
      })
        .then(response => {
          if (!response.ok) throw new Error('Échec de l\'ajout');
          return response.json();
        })
        .then(data => {
          setLocations([...locations, data]);
          setShowAddModal(false);
          navigate('/');
        })
        .catch(err => {
          console.error(err);
          alert("Erreur lors de l'ajout");
        });
    }

    setNewLocation({
      num_loc: '',
      nom_loc: '',
      design_voiture: '',
      nombre_de_jours: '',
      taux_journalier: ''
    });
  };

  const handleDelete = (index) => {
    setLocationToDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const index = locationToDeleteIndex;
    const locationToDelete = locations[index];

    fetch(`http://localhost:4000/location/delete/${locationToDelete.num_loc}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) throw new Error('Échec de la suppression');
        const updatedLocations = [...locations];
        updatedLocations.splice(index, 1);
        setLocations(updatedLocations);
        setShowDeleteModal(false);
        setLocationToDeleteIndex(null);
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors de la suppression");
        setShowDeleteModal(false);
      });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewLocation(locations[index]);
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({ ...newLocation, [name]: value });
  };

  return (
    <div className="container mx-auto p-4 bg-gray-400 h-screen">
      <div className="bg-white shadow-md rounded-lg p-4 h-full flex flex-col justify-between">
        <div className='h-24 w-full'>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Gestion des Locations de Voitures</h1>
          <div className='flex justify-between items-center'>
            <button
              onClick={() => {
                navigate('/location');
                setNewLocation({
                  num_loc: '',
                  nom_loc: '',
                  design_voiture: '',
                  nombre_de_jours: '',
                  taux_journalier: ''
                });
                setEditIndex(null);
                setShowAddModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Ajouter une location
            </button>
            {locations.length > 0 && (
              <button
                onClick={() => {
                  setShowGraphic(true);
                  navigate('/graphique');
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                Visualiser les loyers
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto mb-2 h-full mt-2 ">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="border border-gray-200 px-4 py-2 text-left">N° Location</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Nom Locataire</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Désignation Voiture</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Durée (jours)</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Taux Journalier</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Loyer</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                    Aucune location enregistrée
                  </td>
                </tr>
              ) : (
                locations.map((location, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{location.num_loc}</td>
                    <td className="border border-gray-200 px-4 py-2">{location.nom_loc}</td>
                    <td className="border border-gray-200 px-4 py-2">{location.design_voiture}</td>
                    <td className="border border-gray-200 px-4 py-2">{location.nombre_de_jours}</td>
                    <td className="border border-gray-200 px-4 py-2">{location.taux_journalier}</td>
                    <td className="border border-gray-200 px-4 py-2 font-medium">
                      {(location.nombre_de_jours * location.taux_journalier).toLocaleString()} Ar
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {locations.length > 0 && (
          <div className="bg-gray-200 p-1 px-3 rounded-md w-full h-24">
            <h2 className="text-lg font-semibold mb-4">Résumé des Locations</h2>
            <div className="space-y-2 flex justify-between">
              <div className="flex justify-between b-2 gap-2">
                <span className="text-gray-600">Loyer Total:</span>
                <span className="font-bold">{stats.total.toLocaleString()} Ar</span>
              </div>
              <div className="flex justify-between pb-2 gap-2">
                <span className="text-gray-600">Loyer Minimal:</span>
                <span className="font-bold">{stats.min.toLocaleString()} Ar</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-600">Loyer Maximal:</span>
                <span className="font-bold">{stats.max.toLocaleString()} Ar</span>
              </div>
            </div>

            {showDeleteModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                  <h2 className="text-xl font-bold mb-4 text-red-600">Confirmer la suppression</h2>
                  <p className="mb-4 text-gray-700">Voulez-vous vraiment supprimer cette location ? Cette action est irréversible.</p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showGraphic && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-gray-50 p-8 rounded-lg flex flex-col relative">
                  <button
                    className='absolute top-1 right-1 text-white font-bold text-center bg-red-400 hover:bg-red-500 w-7 h-7 rounded-md'
                    onClick={() => {
                      setShowGraphic(false);
                      navigate('/')
                      }}>
                    X
                  </button>
                  <h2 className="text-lg font-semibold mb-4">Visualisation des Loyers</h2>
                  <BarChart
                    width={600}
                    height={300}
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} Ar`} />
                    <Bar dataKey="valeur" fill="#3B82F6" />
                  </BarChart>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editIndex !== null ? "Modifier la location" : "Ajouter une location"}
              </h2>
              <button
                onClick={() => {
                  navigate('/');
                  setShowAddModal(false)
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom Locataire</label>
                <input
                  type="text"
                  name="nom_loc"
                  value={newLocation.nom_loc}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Désignation Voiture</label>
                <input
                  type="text"
                  name="design_voiture"
                  value={newLocation.design_voiture}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ex: Renault Clio"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (jours)</label>
                  <input
                    type="number"
                    name="nombre_de_jours"
                    value={newLocation.nombre_de_jours}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Ex: 5"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taux Journalier (Ar)</label>
                  <input
                    type="number"
                    name="taux_journalier"
                    value={newLocation.taux_journalier}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Ex: 50000"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  navigate('/');
                  setShowAddModal(false);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Check size={18} />
                {editIndex !== null ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
