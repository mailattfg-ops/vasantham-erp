/**
 * User Profile Settings Page
 */
'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { User, Mail, Shield, Camera, Save, Key } from 'lucide-react'
import { PageHeader, Button, Card, Input } from '@/components/ui'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('Profile updated successfully')
      setLoading(false)
    }, 1000)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    setTimeout(() => {
      toast.success('Password changed successfully')
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal information and security settings"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-tr from-primary to-amber-300 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl mx-auto">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-100 rounded-lg shadow-lg flex items-center justify-center text-gray-500 hover:text-primary transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="mt-4 text-lg font-bold text-text-primary">{user?.name}</h2>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{user?.role}</p>
            <div className="mt-6 pt-6 border-t border-gray-50 text-left space-y-4">
              <div className="flex items-center gap-3 text-text-secondary">
                <Mail className="w-4 h-4" />
                <span className="text-xs">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Shield className="w-4 h-4" />
                <span className="text-xs capitalize">System {user?.role}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* General Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-text-primary">General Information</h3>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="Display Name" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <Input 
                  label="Email Address" 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Security / Password */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-text-primary">Change Password</h3>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input 
                label="Current Password" 
                type="password" 
                value={formData.currentPassword}
                onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="New Password" 
                  type="password" 
                  value={formData.newPassword}
                  onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <Input 
                  label="Confirm New Password" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="ghost" className="text-primary hover:bg-primary/5" type="submit" disabled={loading}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
