import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Save, X, Plus, Search } from "lucide-react";
import { useAlumProfil } from "../hooks/profilesAlum/useAlumProfil";
import type { ProfileAlum } from "../types/app";
import { useUpdateProfile } from "../hooks/profilesAlum/useUpdateProfile";
import { useDeleteProfile } from "../hooks/profilesAlum/useDeleteProfileAlum";

const ProfileTable: React.FC = () => {
  const { allprofiles } = useAlumProfil();
  const [profiles, setProfiles] = useState<ProfileAlum[]>([]);
  const { handleUpdate } = useUpdateProfile();
  const { deleteProfileById, error } = useDeleteProfile();

  const [editingId, setEditingId] = useState<number>(-1);
  const [editForm, setEditForm] = useState<Partial<ProfileAlum>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; profile: ProfileAlum | null }>({
    isOpen: false,
    profile: null
  });

  const handleEdit = (profile: ProfileAlum): void => {
    setEditingId(profile.profile_id);
    setEditForm(profile);
  };

  useEffect(() => {
    if (allprofiles) setProfiles(allprofiles);
  }, [allprofiles, profiles]);

  const handleSave = (): void => {
    if (!profiles) return;
    console.log(editingId);
    setProfiles(
      profiles.map((profile) =>
        profile.profile_id === editingId ? { ...profile, ...editForm } : profile
      )
    );

    handleUpdate(editForm as ProfileAlum, editingId);

    setEditingId(-1);
    setEditForm({});
  };

  const handleCancel = (): void => {
    setEditingId(-1);
    setEditForm({});
  };

  const handleDelete = (profileId: number): void => {
    const profileToDelete = profiles.find(p => p.profile_id === profileId);
    if (profileToDelete) {
      setDeleteModal({ isOpen: true, profile: profileToDelete });
    }
  };

  const confirmDelete = (): void => {
    if (deleteModal.profile) {
      deleteProfileById(deleteModal.profile.profile_id);
      if (!error) {
        setProfiles((prev) => prev.filter((p) => p.profile_id !== deleteModal.profile!.profile_id));
      }
      setDeleteModal({ isOpen: false, profile: null });
    }
  };

  const cancelDelete = (): void => {
    setDeleteModal({ isOpen: false, profile: null });
  };

  const handleInputChange = (
    field: keyof ProfileAlum,
    value: string | number
  ): void => {
    setEditForm({ ...editForm, [field]: value });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.quality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen p-6 relative overflow-hidden overflow-x-auto "
      style={{ backgroundColor: "#0B1739" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold  mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Profile Management
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your profiles with ease
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-gray-800/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            />
          </div>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
            <Plus className="w-5 h-5 mr-2" />
            Add Profile
          </button>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden ">
          <div className="overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border-b border-gray-600/50">
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {filteredProfiles.map((profile, index) => (
                  <tr
                    key={profile.profile_id}
                    className="group hover:bg-gray-800/30 transition-all duration-300 hover:shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {profile.profile_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-300">
                      {editingId === profile.profile_id ? (
                        <input
                          type="number"
                          value={editForm.company || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "company",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm text-white rounded-lg border border-gray-600/50 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all duration-300"
                        />
                      ) : (
                        <span className="font-medium">{profile.company}</span>
                      )}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-300">
                      {editingId === profile.profile_id ? (
                        <input
                          type="text"
                          value={editForm.company_name || ""}
                          onChange={(e) =>
                            handleInputChange("company_name", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm text-white rounded-lg border border-gray-600/50 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all duration-300"
                        />
                      ) : (
                        <span className="font-medium">
                          {profile.company_name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      {editingId === profile.profile_id ? (
                        <input
                          type="text"
                          value={editForm.name || ""}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm text-white rounded-lg border border-gray-600/50 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all duration-300"
                        />
                      ) : (
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {profile.name}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      {editingId === profile.profile_id ? (
                        <input
                          type="text"
                          value={editForm.quality || ""}
                          onChange={(e) =>
                            handleInputChange("quality", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm text-white rounded-lg border border-gray-600/50 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all duration-300"
                        />
                      ) : (
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            profile.quality.toLowerCase().includes("high")
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {profile.quality}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(profile.created_at)}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center">
                      {editingId === profile.profile_id ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={handleSave}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleEdit(profile)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(profile.profile_id)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-400 text-xl font-medium mb-2">
                No profiles found
              </p>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Profiles
                </p>
                <p className="text-2xl font-bold text-white">
                  {profiles.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">{profiles.length}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  High Quality
                </p>
                <p className="text-2xl font-bold text-white">
                  {
                    profiles.filter((p) =>
                      p.quality.toLowerCase().includes("high")
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700/50 shadow-2xl transform transition-all duration-300 scale-100">
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-3">Delete Profile</h3>
              
              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to delete the profile 
                <span className="font-semibold text-white"> "{deleteModal.profile?.name}"</span>? 
                This action cannot be undone.
              </p>

              {/* Profile Details */}
              <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/30">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Company:</span>
                    <p className="text-white font-medium">{deleteModal.profile?.company_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Quality:</span>
                    <p className="text-white font-medium">{deleteModal.profile?.quality}</p>
                  </div>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 border border-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTable;